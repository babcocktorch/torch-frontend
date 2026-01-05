
## Authentication

All admin endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Setup Password (First Login)
**Endpoint:** `POST /admin/auth/setup`

**Description:** First-time password setup for allowlisted admins.

**Request Body:**
```json
{
  "email": "admin@school.edu",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "uuid",
      "email": "admin@school.edu",
      "name": "Admin User"
    }
  }
}
```

**Error Responses:**
- `403` - Email not allowlisted
- `400` - Account already activated
- `400` - Invalid password (must be 8+ chars, 1 uppercase, 1 lowercase, 1 number)

---

### Login
**Endpoint:** `POST /admin/auth/login`

**Description:** Standard login for activated accounts.

**Request Body:**
```json
{
  "email": "admin@school.edu",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "uuid",
      "email": "admin@school.edu",
      "name": "Admin User"
    }
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `403` - Account not activated (password not set)

---

### Get Current Admin
**Endpoint:** `GET /admin/auth/me`

**Description:** Get current authenticated admin's profile.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@school.edu",
      "name": "Admin User"
    }
  }
}
```

**Error Responses:**
- `401` - Invalid or expired token

---

### Logout
**Endpoint:** `POST /admin/auth/logout`

**Description:** Logout (client-side token deletion).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Articles

### Sync Articles from Sanity
**Endpoint:** `POST /admin/articles/sync`

**Description:** Fetch articles from Sanity CMS and sync to database. Creates new articles or updates existing ones (preserves visibility and editor's pick status).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Articles synced successfully",
    "created": 5,
    "updated": 3,
    "total": 8
  }
}
```

**Notes:**
- New articles default to `visibility: "private"`
- `isPost` is automatically inferred from `type` field (`type === "post"`)
- Metadata (title, slug, author, type) is updated on sync
- Visibility and editor's pick status are preserved

---

### List All Articles (Admin)
**Endpoint:** `GET /admin/articles`

**Description:** Get all articles with admin metadata.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "sanityId": "sanity-id",
        "title": "Article Title",
        "slug": "article-slug",
        "author": "John Doe",
        "type": "post",
        "isPost": true,
        "visibility": "public",
        "isEditorsPick": true,
        "lastSyncedAt": "2026-01-03T10:00:00Z"
      }
    ]
  }
}
```

---

### Update Article Visibility
**Endpoint:** `PATCH /admin/articles/:id/visibility`

**Description:** Change article visibility between public and private.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "visibility": "public"
}
```

**Valid Values:** `"public"` | `"private"`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "uuid",
      "sanityId": "sanity-id",
      "title": "Article Title",
      "slug": "article-slug",
      "author": "John Doe",
      "type": "post",
      "isPost": true,
      "visibility": "public",
      "isEditorsPick": false,
      "lastSyncedAt": "2026-01-03T10:00:00Z",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - Invalid visibility value
- `404` - Article not found

---

### Set Editor's Pick
**Endpoint:** `POST /admin/articles/:id/editors-pick`

**Description:** Set article as Editor's Pick. Only ONE article can be Editor's Pick at a time. Only articles with `type === "post"` can be set as Editor's Pick.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Article set as Editor's Pick",
    "article": {
      "id": "uuid",
      "sanityId": "sanity-id",
      "title": "Article Title",
      "slug": "article-slug",
      "author": "John Doe",
      "type": "post",
      "isPost": true,
      "visibility": "public",
      "isEditorsPick": true,
      "lastSyncedAt": "2026-01-03T10:00:00Z",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

**Error Responses:**
- `404` - Article not found
- `400` - Only posts can be set as Editor's Pick (when `isPost === false`)

**Business Rules:**
- Previous Editor's Pick is automatically unset
- Only articles where `type === "post"` (i.e., `isPost === true`) can be Editor's Pick
- Articles with `type === "opinion"`, `"news"`, `"article"`, etc. cannot be Editor's Pick

---

### Get Public Articles (Frontend)
**Endpoint:** `GET /articles`

**Description:** Get all public articles (no authentication required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "sanityId": "sanity-id",
        "title": "Article Title",
        "slug": "article-slug",
        "author": "John Doe",
        "type": "post",
        "isPost": true,
        "isEditorsPick": true,
        "lastSyncedAt": "2026-01-03T10:00:00Z"
      }
    ]
  }
}
```

**Notes:**
- Only returns articles with `visibility: "public"`
- Editor's Pick is included in the list

---

### Get Single Public Article
**Endpoint:** `GET /articles/:slug`

**Description:** Get a single public article by slug (no authentication required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "uuid",
      "sanityId": "sanity-id",
      "title": "Article Title",
      "slug": "article-slug",
      "author": "John Doe",
      "type": "post",
      "isPost": true,
      "isEditorsPick": false,
      "lastSyncedAt": "2026-01-03T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `404` - Article not found or not public

---