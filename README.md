# Prisma Blog Application Backend

This is the backend of a **Blog Application** built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM**. The application follows a **modular pattern** for scalability and maintainability and uses **Better Auth** for secure authentication.

---

## Features

- User authentication and authorization (Admin and Regular Users)
- CRUD operations for **Posts**
- Commenting system with moderation
- Post and Comment status management (Publish, Draft, Approve, Reject)
- Role-based access control (Admin vs User)
- Modular folder structure for clean code organization

---

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth
- **Pattern:** Modular structure

---

## ERD & Flow Diagram

### User Roles & Permissions
![Flow Diagram](./images/flow-diagram.png)

### Database Schema
![ERD](./images/erd-diagram.png)

---

## Database Models

### User
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary Key |
| name | String | User Name |
| email | String | Unique Email |
| role | Enum (ADMIN, USER) | Role of user |

### Post
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary Key |
| title | String | Post title |
| content | String | Post content |
| thumbnail | String? | Optional thumbnail image |
| isFeatured | Boolean? | Optional featured flag |
| status | Enum (ARCHIVE, PUBLISHED, DRAFT) | Post status |
| tags | String[] | Tags |
| views | Int | Number of views |
| authorId | String | Foreign Key to User |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

### Comment
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary Key |
| content | String | Comment text |
| authorId | String | Foreign Key to User |
| postId | String | Foreign Key to Post |
| parentId | String? | Optional parent comment for replies |
| status | Enum (APPROVE, REJECT) | Comment status |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

---

## Relationships

- One **User** → Many **Posts**
- One **Post** → Many **Comments**
- One **Comment** → Optional Parent Comment (for nested comments)

---

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
