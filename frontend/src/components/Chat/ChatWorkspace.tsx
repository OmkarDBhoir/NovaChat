import { useMemo, useState, type FC, type FormEvent } from 'react'
import { setAuthToken } from '../../api/axios'

type Message = { id: number; author: string; initials: string; text: string; time: string; mine?: boolean }
type Chat = {
    id: number; name: string; initials: string; color: string; preview: string; time: string
    unread?: number; online?: boolean; messages: Message[]
}
type ChatWorkspaceProps = { onLogout: () => void }

const initialChats: Chat[] = [
    {
        id: 1, name: 'Product design', initials: 'PD', color: 'coral', preview: 'Maya: The new flow feels really clear.', time: '10:42 AM', unread: 3, online: true,
        messages: [
            { id: 1, author: 'Maya Chen', initials: 'MC', text: 'The new onboarding flow is ready for a final look.', time: '10:36 AM' },
            { id: 2, author: 'You', initials: 'OM', text: 'I am looking at it now. The first step feels much clearer.', time: '10:38 AM', mine: true },
            { id: 3, author: 'Maya Chen', initials: 'MC', text: 'That was the goal. I also tightened the empty states and added the mobile pass.', time: '10:40 AM' },
            { id: 4, author: 'Maya Chen', initials: 'MC', text: 'The new flow feels really clear. Shall we ship it to staging?', time: '10:42 AM' },
        ],
    },
    {
        id: 2, name: 'Engineering', initials: 'EN', color: 'mint', preview: 'Alex: API is live on staging.', time: '9:18 AM', online: true,
        messages: [
            { id: 1, author: 'Alex Morgan', initials: 'AM', text: 'API is live on staging. Auth headers are working end to end.', time: '9:18 AM' },
            { id: 2, author: 'You', initials: 'OM', text: 'Perfect. I will connect the chat screens next.', time: '9:22 AM', mine: true },
        ],
    },
    {
        id: 3, name: 'Weekend plans', initials: 'WP', color: 'lavender', preview: 'Nina: Saturday at 7 works for me.', time: 'Yesterday',
        messages: [{ id: 1, author: 'Nina Patel', initials: 'NP', text: 'Saturday at 7 works for me. I found a great little place downtown.', time: 'Yesterday' }],
    },
    {
        id: 4, name: 'NovaChat team', initials: 'NT', color: 'blue', preview: 'You: Welcome to the new workspace.', time: 'Monday',
        messages: [{ id: 1, author: 'You', initials: 'OM', text: 'Welcome to the new workspace. Let us keep everything in one place.', time: 'Monday', mine: true }],
    },
]

const ChatWorkspace: FC<ChatWorkspaceProps> = ({ onLogout }) => {
    const [chats, setChats] = useState(initialChats)
    const [selectedChatId, setSelectedChatId] = useState(1)
    const [search, setSearch] = useState('')
    const [draft, setDraft] = useState('')
    const [showSidebar, setShowSidebar] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('novaTheme') === 'dark' ? 'dark' : 'light')
    const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? chats[0]
    const filteredChats = useMemo(() => chats.filter((chat) => `${chat.name} ${chat.preview}`.toLowerCase().includes(search.toLowerCase())), [chats, search])

    const selectChat = (id: number) => {
        setSelectedChatId(id)
        setShowSidebar(false)
        setChats((current) => current.map((chat) => chat.id === id ? { ...chat, unread: 0 } : chat))
    }

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const text = draft.trim()
        if (!text) return
        setChats((current) => current.map((chat) => chat.id === selectedChat.id ? {
            ...chat, preview: `You: ${text}`, time: 'Just now',
            messages: [...chat.messages, { id: Date.now(), author: 'You', initials: 'OM', text, time: 'Just now', mine: true }],
        } : chat))
        setDraft('')
    }

    const logout = () => { setAuthToken(null); onLogout() }
    const toggleTheme = () => {
        setTheme((current) => {
            const nextTheme = current === 'light' ? 'dark' : 'light'
            localStorage.setItem('novaTheme', nextTheme)
            return nextTheme
        })
    }

    return (
        <main className={`chat-app ${theme === 'dark' ? 'theme-dark' : ''}`}>
            <aside className={`chat-sidebar ${showSidebar ? 'chat-sidebar-open' : ''}`}>
                <div className="brand-row"><div className="brand-mark">N</div><span>NovaChat</span><button className="icon-button sidebar-close" type="button" onClick={() => setShowSidebar(false)} aria-label="Close conversations">x</button></div>
                <button className="new-chat-button" type="button" onClick={() => setDraft('')}><span className="plus-icon">+</span>New conversation<span className="shortcut">N</span></button>
                <div className="conversation-heading"><span>Conversations</span><button className="icon-button" type="button" aria-label="Conversation options">...</button></div>
                <label className="search-box"><span aria-hidden="true">/</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" /><kbd>Cmd K</kbd></label>
                <nav className="conversation-list" aria-label="Conversations">
                    {filteredChats.map((chat) => <button key={chat.id} className={`conversation-item ${selectedChat.id === chat.id ? 'conversation-active' : ''}`} type="button" onClick={() => selectChat(chat.id)}>
                        <span className={`avatar avatar-${chat.color}`}>{chat.initials}</span><span className="conversation-copy"><span className="conversation-name"><strong>{chat.name}</strong><small>{chat.time}</small></span><span className="conversation-preview">{chat.preview}</span></span>{chat.unread ? <span className="unread-count">{chat.unread}</span> : null}
                    </button>)}
                    {!filteredChats.length && <p className="empty-search">No conversations found.</p>}
                </nav>
                <div className="sidebar-footer"><div className="profile-row"><span className="avatar avatar-amber">OM</span><span><strong>Omkar</strong><small>Personal workspace</small></span><button className="icon-button" type="button" onClick={logout} aria-label="Log out">out</button></div></div>
            </aside>

            <section className="chat-main">
                <header className="chat-header"><button className="icon-button menu-button" type="button" onClick={() => setShowSidebar(true)} aria-label="Open conversations">menu</button><div className="chat-title"><span className={`avatar avatar-${selectedChat.color} avatar-small`}>{selectedChat.initials}</span><span><strong>{selectedChat.name}</strong><small><i />{selectedChat.online ? 'Active now' : 'Last active recently'}</small></span></div><div className="header-actions"><button className="icon-button" type="button" aria-label="Start video call">video</button><button className="icon-button" type="button" aria-label="Start audio call">call</button><button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} aria-pressed={theme === 'dark'}>{theme === 'light' ? 'dark' : 'light'}</button><button className="icon-button" type="button" aria-label="More options">...</button></div></header>
                <div className="message-area"><div className="date-divider"><span>Today</span></div><div className="message-stack">{selectedChat.messages.map((message) => <article key={message.id} className={`message-row ${message.mine ? 'message-mine' : ''}`}>{!message.mine && <span className="avatar avatar-sand avatar-message">{message.initials}</span>}<div className="message-content"><div className="message-meta"><strong>{message.author}</strong><time>{message.time}</time></div><p>{message.text}</p></div></article>)}</div></div>
                <form className="composer-wrap" onSubmit={sendMessage}><div className="composer"><button className="composer-action" type="button" aria-label="Attach a file">+</button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${selectedChat.name}`} aria-label={`Message ${selectedChat.name}`} /><button className="composer-action" type="button" aria-label="Add emoji">smile</button><button className="send-button" type="submit" aria-label="Send message">send</button></div><span className="composer-hint">Press Enter to send <span>Shift + Enter for a new line</span></span></form>
            </section>

            <aside className="details-panel"><div className="details-top"><span>Conversation details</span><button className="icon-button" type="button" aria-label="Close details">x</button></div><div className="details-profile"><span className={`avatar avatar-${selectedChat.color} avatar-large`}>{selectedChat.initials}</span><h2>{selectedChat.name}</h2><p>{selectedChat.online ? '4 members, 2 online' : '4 members'}</p></div><div className="detail-section"><div className="detail-label"><span>Shared media</span><button type="button">See all</button></div><div className="media-grid"><span className="media-tile media-one">N</span><span className="media-tile media-two">+</span><span className="media-tile media-three">chat</span></div></div><div className="detail-section detail-links"><button type="button"><span className="detail-icon">pin</span>Pinned messages<span>2</span></button><button type="button"><span className="detail-icon">file</span>Shared files<span>8</span></button><button type="button"><span className="detail-icon">bell</span>Notifications<span>on</span></button></div></aside>
        </main>
    )
}

export default ChatWorkspace