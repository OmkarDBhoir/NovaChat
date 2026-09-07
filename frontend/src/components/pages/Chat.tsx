import { useEffect, useState, type SyntheticEvent, } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";
import { getConversations, createConversation, } from "../../api/conversationApi";
import { getMessages, sendMessage, } from "../../api/messageApi";
import { searchUsers, } from "../../api/userApi";
import type { ConversationListResponse, } from "../../types/conversation";
import type { MessageResponse, } from "../../types/message";
import type { UserSearchResult, } from "../../types/user";

const Chat = () => {
    const { user, logout, } = useAuth();
    const [conversations, setConversations] = useState<ConversationListResponse[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationListResponse | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {

        const loadConversations = async () => {

            try {

                setLoadingConversations(true);

                const data = await getConversations();

                setConversations(data);

            } catch (error) {

                console.error(
                    "Failed to load conversations",
                    error
                );

            } finally {

                setLoadingConversations(false);
            }
        };

        loadConversations();

    }, []);

    useEffect(() => {

        if (!selectedConversation) {
            setMessages([]);
            return;
        }

        const loadMessages = async () => {

            try {

                setLoadingMessages(true);

                const response = await getMessages(
                    selectedConversation.id
                );

                setMessages(response.content);

            } catch (error) {

                console.error(
                    "Failed to load messages",
                    error
                );

                setMessages([]);

            } finally {

                setLoadingMessages(false);
            }
        };

        loadMessages();

    }, [selectedConversation]);

    useEffect(() => {

        if (!searchQuery.trim()) {

            setSearchResults([]);

            return;
        }

        const search = async () => {

            try {

                const results = await searchUsers(
                    searchQuery
                );

                setSearchResults(results);

            } catch (error) {

                console.error(
                    "Failed to search users",
                    error
                );

                setSearchResults([]);
            }
        };

        const timeout = setTimeout(
            search,
            300
        );

        return () => clearTimeout(timeout);

    }, [searchQuery]);

    const handleUserSelect = async (
        selectedUser: UserSearchResult
    ) => {

        try {

            const conversation = await createConversation({ userId: selectedUser.id, });
            const updatedConversations = await getConversations();
            setConversations(updatedConversations);
            const conversationFromList = updatedConversations.find(item => item.id === conversation.id);

            if (conversationFromList) {
                setSelectedConversation(conversationFromList);
            }
            setSearchQuery("");
            setSearchResults([]);

        } catch (error) {
            console.error("Failed to create conversation", error);
        }
    };

    const handleSendMessage = async (event: SyntheticEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (!selectedConversation || !message.trim() || sendingMessage) {
            return;
        }

        try {

            setSendingMessage(true);
            const newMessage = await sendMessage(selectedConversation.id, { content: message.trim(), });
            setMessages(previous => [...previous, newMessage,]);

            setMessage("");

            const updatedConversations =
                await getConversations();

            setConversations(
                updatedConversations
            );
            const updatedSelectedConversation = updatedConversations.find(conversation => conversation.id === selectedConversation.id);

            if (updatedSelectedConversation) {
                setSelectedConversation(updatedSelectedConversation);
            }

        } catch (error) {
            console.error("Failed to send message", error);

        } finally {
            setSendingMessage(false);
        }
    };

    const formatTime = (
        date: string
    ) => {

        return new Date(date).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    return (
        <div className="h-screen overflow-hidden bg-slate-100">

            <div className="flex h-full">


                <aside
                    className="
                        flex w-80 shrink-0 flex-col
                        border-r border-slate-200
                        bg-white
                    "
                >
                    <div className=" flex h-16 items-center border-b border-slate-200 px-5 " >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-xl
                                    bg-indigo-600
                                    font-bold
                                    text-white
                                "
                            >
                                N
                            </div>

                            <span
                                className="
                                    text-lg font-bold
                                    text-slate-900
                                "
                            >
                                NovaChat
                            </span>

                        </div>

                    </div>

                    <div
                        className="
                            relative
                            border-b border-slate-200
                            p-4
                        "
                    >

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            className="
                                w-full rounded-xl
                                border border-slate-200
                                bg-slate-50
                                py-2.5 pl-10 pr-3
                                text-sm
                                outline-none
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-500/20
                            "
                        />

                        <svg
                            className="
                                absolute left-7 top-7
                                h-4 w-4
                                text-slate-400
                            "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="
                                    m21 21-4.35-4.35
                                    m2.35-5.65
                                    a8 8 0 1 1-16 0
                                    8 8 0 0 1 16 0Z
                                "
                            />
                        </svg>

                        {searchResults.length > 0 && (

                            <div
                                className="
                                    absolute left-4 right-4
                                    top-full z-20
                                    mt-2
                                    overflow-hidden
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    shadow-lg
                                "
                            >

                                {searchResults.map(
                                    searchUser => (

                                        <button
                                            key={searchUser.id}
                                            type="button"
                                            onClick={() =>
                                                handleUserSelect(
                                                    searchUser
                                                )
                                            }
                                            className="
                                                flex w-full
                                                items-center gap-3
                                                px-3 py-3
                                                text-left
                                                hover:bg-slate-50
                                            "
                                        >

                                            <div
                                                className="
                                                    flex h-10 w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-indigo-100
                                                    font-semibold
                                                    text-indigo-700
                                                "
                                            >
                                                {searchUser.username
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-900
                                                    "
                                                >
                                                    {
                                                        searchUser.username
                                                    }
                                                </p>

                                            </div>

                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    <div className="flex-1 overflow-y-auto">

                        <div className="px-4 py-3">

                            <p
                                className="
                                    text-xs font-semibold
                                    uppercase tracking-wider
                                    text-slate-400
                                "
                            >
                                Conversations
                            </p>

                        </div>


                        {loadingConversations ? (

                            <div className="px-4 py-6 text-center">

                                <p className="text-sm text-slate-400">
                                    Loading conversations...
                                </p>

                            </div>

                        ) : conversations.length === 0 ? (

                            <div className="px-4 py-6 text-center">

                                <p className="text-sm text-slate-400">
                                    No conversations yet.
                                </p>

                                <p
                                    className="
                                        mt-1 text-xs
                                        text-slate-400
                                    "
                                >
                                    Search for a user to start chatting.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-1 px-2">

                                {conversations.map(
                                    conversation => (

                                        <button
                                            key={conversation.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedConversation(
                                                    conversation
                                                )
                                            }
                                            className={` w - full rounded - xl px - 3 py - 3 text - left transition ${selectedConversation?.id === conversation.id ? "bg-indigo-50" : "hover:bg-slate-50"} `}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        flex h-11 w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-indigo-600
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    {conversation.otherUsername
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                truncate
                                                                text-sm
                                                                font-semibold
                                                                text-slate-900
                                                            "
                                                        >
                                                            {
                                                                conversation.otherUsername
                                                            }
                                                        </p>

                                                        {conversation.lastMessage && (

                                                            <span
                                                                className="
                                                                    ml-2
                                                                    shrink-0
                                                                    text-xs
                                                                    text-slate-400
                                                                "
                                                            >
                                                                {formatTime(
                                                                    conversation
                                                                        .lastMessage
                                                                        .createdAt
                                                                )}
                                                            </span>

                                                        )}

                                                    </div>


                                                    <p
                                                        className="
                                                            mt-1 truncate
                                                            text-xs
                                                            text-slate-500
                                                        "
                                                    >
                                                        {
                                                            conversation
                                                                .lastMessage
                                                                ?.content ??
                                                            "No messages yet"
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>


                    {/* Current User */}

                    <div
                        className="
                            border-t border-slate-200
                            p-3
                        "
                    >

                        <div
                            className="
                                flex items-center gap-3
                                rounded-xl p-2
                            "
                        >

                            <div className="relative">

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-slate-700
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {user?.username
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <span
                                    className="
                                        absolute bottom-0 right-0
                                        h-3 w-3
                                        rounded-full
                                        border-2 border-white
                                        bg-green-500
                                    "
                                />

                            </div>


                            <div className="min-w-0 flex-1">

                                <p
                                    className="
                                        truncate text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    {user?.username}
                                </p>

                                <p className="text-xs text-green-600">
                                    Online
                                </p>

                            </div>


                            <Button
                                variant="ghost"
                                onClick={logout}
                                className="px-2"
                            >
                                Logout
                            </Button>

                        </div>

                    </div>

                </aside>

                <main
                    className="
                        flex min-w-0
                        flex-1 flex-col
                    "
                >

                    {!selectedConversation ? (

                        <div
                            className="
                                flex flex-1
                                items-center justify-center
                                bg-slate-50
                            "
                        >

                            <div className="text-center">

                                <div
                                    className="
                                        mx-auto mb-4
                                        flex h-16 w-16
                                        items-center justify-center
                                        rounded-full
                                        bg-indigo-100
                                        text-2xl
                                    "
                                >
                                    💬
                                </div>

                                <h3
                                    className="
                                        text-lg font-semibold
                                        text-slate-800
                                    "
                                >
                                    Welcome to NovaChat
                                </h3>

                                <p
                                    className="
                                        mt-1 text-sm
                                        text-slate-500
                                    "
                                >
                                    Select a conversation to start chatting.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>

                            {/* Chat Header */}

                            <header
                                className="
                                    flex h-16
                                    items-center
                                    border-b border-slate-200
                                    bg-white
                                    px-6
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex h-10 w-10
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-indigo-600
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {selectedConversation.otherUsername
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <h2
                                            className="
                                                text-sm font-semibold
                                                text-slate-900
                                            "
                                        >
                                            {
                                                selectedConversation
                                                    .otherUsername
                                            }
                                        </h2>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Direct message
                                        </p>

                                    </div>

                                </div>

                            </header>


                            {/* Messages */}

                            <div
                                className="
                                    flex-1 overflow-y-auto
                                    bg-slate-50 p-6
                                "
                            >

                                {loadingMessages ? (

                                    <div
                                        className="
                                            flex h-full
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <p className="text-sm text-slate-400">
                                            Loading messages...
                                        </p>

                                    </div>

                                ) : messages.length === 0 ? (

                                    <div
                                        className="
                                            flex h-full
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <div className="text-center">

                                            <div
                                                className="
                                                    mx-auto mb-4
                                                    flex h-14 w-14
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-indigo-100
                                                    text-xl
                                                "
                                            >
                                                👋
                                            </div>

                                            <h3
                                                className="
                                                    text-lg
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                Say hello!
                                            </h3>

                                            <p
                                                className="
                                                    mt-1 text-sm
                                                    text-slate-500
                                                "
                                            >
                                                Start your conversation with{" "}
                                                {
                                                    selectedConversation
                                                        .otherUsername
                                                }.
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {messages.map(
                                            currentMessage => {

                                                const isOwnMessage =
                                                    currentMessage.senderId ===
                                                    user?.id;

                                                return (

                                                    <div key={currentMessage.id} className={` flex ${isOwnMessage ? "justify-end" : "justify-start" } `} >

                                                        <div className={` max - w - [70 %] rounded - 2xl px - 4 py - 2.5 ${isOwnMessage ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md bg-white text-slate-900 shadow-sm"} `}>
                                                            <p
                                                                className="
                                                                    whitespace-pre-wrap
                                                                    break-words
                                                                    text-sm
                                                                "
                                                            >
                                                                {
                                                                    currentMessage.content
                                                                }
                                                            </p>

                                                            <p
                                                                className={`
mt - 1
text - right
text - [10px]
                                                                    ${isOwnMessage
                                                                        ? "text-indigo-200"
                                                                        : "text-slate-400"
                                                                    }
`}
                                                            >
                                                                {formatTime(
                                                                    currentMessage
                                                                        .createdAt
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>


                            {/* Message Input */}

                            <div
                                className="
                                    border-t border-slate-200
                                    bg-white p-4
                                "
                            >

                                <form
                                    onSubmit={handleSendMessage}
                                    className="
                                        flex items-center gap-3
                                    "
                                >

                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={event =>
                                            setMessage(
                                                event.target.value
                                            )
                                        }
                                        className="
                                            flex-1 rounded-xl
                                            border border-slate-200
                                            bg-slate-50
                                            px-4 py-3
                                            text-sm
                                            outline-none
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-500/20
                                        "
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            !message.trim() ||
                                            sendingMessage
                                        }
                                        className="
                                            flex h-11 w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-indigo-600
                                            text-white
                                            transition
                                            hover:bg-indigo-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        ➤
                                    </button>

                                </form>

                            </div>

                        </>
                    )}

                </main>

            </div>

        </div>
    );
};

export default Chat;
