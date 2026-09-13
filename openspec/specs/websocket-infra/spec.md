# WebSocket Infrastructure Specification

## Purpose

FastAPI WebSocket endpoint with Clerk JWT authentication for future real-time features (leaderboards, notifications).

## Requirements

### Requirement: WebSocket Authentication

The system SHALL validate Clerk JWT from the first WebSocket message before accepting the connection.

#### Scenario: Valid JWT on connect

- GIVEN a client sends a WebSocket message with valid Clerk JWT
- WHEN the server validates the token
- THEN the connection is accepted and user context is established

#### Scenario: Invalid JWT on connect

- GIVEN a client sends a WebSocket message with invalid JWT
- WHEN the server validates the token
- THEN the server closes the connection with code 4001

### Requirement: Connection Manager

The system SHALL maintain a connection registry mapping user IDs to active WebSocket connections.

#### Scenario: Track user connection

- GIVEN user A connects via WebSocket with valid JWT
- WHEN the connection is established
- THEN user A's connection is registered in the connection manager

#### Scenario: Multiple connections per user

- GIVEN user A has two active WebSocket connections
- WHEN user A connects a third time
- THEN the new connection is registered (old connections are NOT forcibly closed)

### Requirement: Timeout Handling

The system SHALL close idle WebSocket connections after a configurable timeout.

#### Scenario: Idle timeout

- GIVEN a WebSocket connection has been idle for the configured timeout period
- WHEN the timeout check runs
- THEN the connection is closed with code 4000

#### Scenario: Active connection not closed

- GIVEN a WebSocket connection received a message within the timeout window
- WHEN the timeout check runs
- THEN the connection remains open

### Requirement: Event Subscription

The system SHALL support per-connection event type subscriptions.

#### Scenario: Subscribe to events

- GIVEN a client sends `{"type": "subscribe", "events": ["leaderboard", "achievements"]`
- WHEN an achievement event occurs for that user
- THEN the client receives the event payload

#### Scenario: Unsubscribed event

- GIVEN a client is subscribed to `leaderboard` only
- WHEN a `notifications` event occurs
- THEN the client does NOT receive the notification event

### Requirement: Disconnect Cleanup

The system SHALL remove user connections from the registry on disconnect.

#### Scenario: Clean disconnect

- GIVEN user A is connected
- WHEN user A's WebSocket closes normally
- THEN user A's entry is removed from the connection manager
