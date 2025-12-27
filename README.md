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

2.Install dependencies:
npm install

3.Configure environment variables:
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"
JWT_SECRET="your_jwt_secret"

4.Run Prisma migrations:
npx prisma migrate dev

5.Start the server:
npm run dev


Folder Structure
├── src
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── utils
│   └── index.ts
├── prisma
│   ├── schema.prisma
│   └── migrations
├── package.json
└── README.md


API Endpoints
Auth

POST /auth/register - Register a user

POST /auth/login - Login a user

Posts

GET /posts - Get all posts

POST /posts - Create post (Admin/User)

PUT /posts/:id - Update post (Admin/User)

DELETE /posts/:id - Delete post (Admin/User)

Comments

POST /comments - Add comment

PUT /comments/:id - Approve/Reject comment (Admin)

DELETE /comments/:id - Delete comment
