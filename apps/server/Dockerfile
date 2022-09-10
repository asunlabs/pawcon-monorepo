FROM golang:1.19

ARG source=.
WORKDIR /server

COPY ${source} .
RUN go mod download

# The -o flag forces build to write the resulting executable
# or object to the named output file or directory
# generate go executable
RUN go build -o /build

# container port
EXPOSE 3001

# Configures the container to be run as an executable.
ENTRYPOINT ["/build"]