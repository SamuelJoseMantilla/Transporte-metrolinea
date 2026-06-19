# MetroLinea - Entity Relationship Diagram

## Overview

```mermaid
erDiagram
    users ||--o{ buses : "registers"
    routes ||--o{ route_stops : "contains"
    stops ||--o{ route_stops : "belongs to"
    routes ||--o{ buses : "assigned to"
    routes ||--o{ alerts : "triggers"
    buses ||--o{ bus_locations : "produces"
    buses ||--o{ eta_predictions : "produces"
    buses ||--o{ alerts : "triggers"
    stops ||--o{ eta_predictions : "receives"

    users {
        serial id PK
        varchar username UK
        varchar email UK
        varchar hashed_password
        varchar full_name
        boolean is_active
        boolean is_admin
        timestamptz created_at
        timestamptz updated_at
    }

    routes {
        serial id PK
        varchar name
        varchar code UK
        text description
        varchar color
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    stops {
        serial id PK
        varchar name
        varchar code UK
        float latitude
        float longitude
        varchar address
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    route_stops {
        serial id PK
        integer route_id FK
        integer stop_id FK
        integer sequence
        float distance_from_start_km
        timestamptz created_at
    }

    buses {
        serial id PK
        varchar plate_number UK
        varchar internal_code UK
        integer capacity
        boolean is_active
        integer route_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    bus_locations {
        serial id PK
        integer bus_id FK
        float latitude
        float longitude
        float speed_kmh
        float heading
        timestamptz recorded_at
    }

    eta_predictions {
        serial id PK
        integer bus_id FK
        integer stop_id FK
        integer eta_seconds
        float distance_km
        float congestion_factor
        float time_factor
        timestamptz calculated_at
    }

    alerts {
        serial id PK
        integer bus_id FK
        integer route_id FK
        varchar alert_type
        varchar title
        text message
        varchar severity
        boolean is_active
        float latitude
        float longitude
        timestamptz created_at
        timestamptz resolved_at
    }
```

## Relationships

| Relationship | Type | Description |
|---|---|---|
| routes → route_stops | 1:N | A route has many stops |
| stops → route_stops | 1:N | A stop belongs to many routes |
| routes → buses | 1:N | A route has many buses |
| buses → bus_locations | 1:N | A bus has many GPS records |
| buses → eta_predictions | 1:N | A bus has many ETA predictions |
| stops → eta_predictions | 1:N | A stop has many ETA predictions |
| buses → alerts | 1:N | A bus can trigger many alerts |
| routes → alerts | 1:N | A route can have many alerts |

## Constraints

| Table | Constraint | Type |
|---|---|---|
| route_stops | uq_route_stop | UNIQUE(route_id, stop_id) |
| alerts | chk_alert_type | IN (DELAY, CONGESTION, BUS_STOPPED, MAINTENANCE, ROUTE_CHANGE) |
| alerts | chk_severity | IN (LOW, MEDIUM, HIGH, CRITICAL) |
| stops | latitude | -90 to 90 |
| stops | longitude | -180 to 180 |

## Cascade Delete Rules

| Parent | Child | Action |
|---|---|---|
| routes | route_stops | CASCADE |
| stops | route_stops | CASCADE |
| buses | bus_locations | CASCADE |
| buses | eta_predictions | CASCADE |
| stops | eta_predictions | CASCADE |
| buses | alerts | CASCADE |
| routes | alerts | CASCADE |

## Indexes

All primary keys and foreign keys are indexed. Additional indexes:
- `idx_users_username`, `idx_users_email`
- `idx_routes_name`, `idx_routes_code`
- `idx_stops_name`, `idx_stops_code`
- `idx_buses_plate_number`, `idx_buses_internal_code`
- `idx_bus_locations_bus_time` (bus_id, recorded_at DESC)
- `idx_alerts_alert_type`, `idx_alerts_is_active`
