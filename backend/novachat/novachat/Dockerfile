FROM eclipse-temurin:25-jdk as builder

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw package -DskipTests

FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]