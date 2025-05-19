# API Documentation

# Group Management APIs

## Overview
These endpoints handle group management operations. Groups are used to categorize branches (e.g., Vocational and General branches).

## Required Permissions
- `view-groups`: Required for viewing groups
- No other permissions as only read operations are supported

## Endpoints

### 1. Get All Groups
- **URL**: `/api/groups`
- **Method**: `GET`
- **Authentication**: Required
- **Permission Required**: `view-groups`
- **Description**: Retrieves all available groups in the system
- **Query Parameters**: None
- **Response Format**:
  ```json
  [
    {
      "id": 1,
      "name": "Vocational",
      "createdAt": "2025-05-17T10:00:00.000Z",
      "updatedAt": "2025-05-17T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "General",
      "createdAt": "2025-05-17T10:00:00.000Z",
      "updatedAt": "2025-05-17T10:00:00.000Z"
    }
  ]
  ```
- **Error Response**: 
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

### 2. Get Group by ID
- **URL**: `/api/groups/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Permission Required**: `view-groups`
- **Description**: Retrieves a specific group by its ID
- **URL Parameters**:
  - `id`: The numeric ID of the group (required)
- **Response Format**:
  ```json
  {
    "id": 1,
    "name": "Vocational",
    "createdAt": "2025-05-17T10:00:00.000Z",
    "updatedAt": "2025-05-17T10:00:00.000Z"
  }
  ```
- **Error Response**: 
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

## Schema Information
Groups are defined in the database with the following structure:
```prisma
model Group {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  branches  Branch[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @default(now()) @updatedAt
}
```

## Notes
1. All endpoints require authentication
2. Users must have the `view-groups` permission to access these endpoints
3. Groups are used to categorize branches (e.g., Vocational vs General streams)
4. Currently, only read operations are supported (GET endpoints)

# Academic Year Management APIs

## Overview
These endpoints handle academic year operations. Academic years can be associated with branches and are used to organize educational content.

## Required Permissions
- `manage-academic-years`: Required for create, update, and delete operations
- No specific permission required for viewing academic years

## Endpoints

### 1. Get All Academic Years
- **URL**: `/api/academic-years`
- **Method**: `GET`
- **Authentication**: Required
- **Permission Required**: None
- **Description**: Retrieves all academic years, sorted by label in ascending order
- **Query Parameters**: None
- **Response Format**:
  ```json
  [
    {
      "id": 1,
      "label": "1st year",
      "code": "1_year",
      "createdAt": "2025-05-17T10:00:00.000Z",
      "updatedAt": "2025-05-17T10:00:00.000Z"
    }
  ]
  ```
- **Error Response**:
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

### 2. Create Academic Year
- **URL**: `/api/academic-years`
- **Method**: `POST`
- **Authentication**: Required
- **Permission Required**: `manage-academic-years`
- **Description**: Creates a new academic year
- **Request Body**:
  ```json
  {
    "label": "1st year"
  }
  ```
- **Response Format**:
  ```json
  {
    "id": 1,
    "label": "1st year",
    "createdAt": "2025-05-17T10:00:00.000Z",
    "updatedAt": "2025-05-17T10:00:00.000Z",
    "createdById": 1,
    "updatedById": 1
  }
  ```
- **Error Responses**:
  ```json
  {
    "error": "Academic year already exists"
  }
  ```
  Status Code: 400
  
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

### 3. Update Academic Year
- **URL**: `/api/academic-years/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Permission Required**: `manage-academic-years`
- **Description**: Updates an existing academic year
- **URL Parameters**:
  - `id`: The numeric ID of the academic year (required)
- **Request Body**:
  ```json
  {
    "label": "Updated 1st year"
  }
  ```
- **Response Format**: Same as Create Academic Year response
- **Error Responses**:
  ```json
  {
    "error": "Academic year already exists"
  }
  ```
  Status Code: 400
  
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

### 4. Delete Academic Year
- **URL**: `/api/academic-years/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Permission Required**: `manage-academic-years`
- **Description**: Deletes an academic year if it's not being used
- **URL Parameters**:
  - `id`: The numeric ID of the academic year (required)
- **Response Format**:
  ```json
  {
    "message": "Academic year deleted successfully"
  }
  ```
- **Error Responses**:
  ```json
  {
    "error": "Cannot delete academic year as it is being used by books or subjects"
  }
  ```
  Status Code: 400
  
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

## Schema Information
Academic Years are defined in the database with the following structure:
```prisma
model AcademicYear {
  id       Int       @id @default(autoincrement())
  label    String    
  code     String    @unique
  books    Book[]
  branchs  Branch[]  @relation("AcademicYearToBranch")
  subjects Subject[] @relation("AcademicYearToSubject")
  chpaters Chapter[]
}
```

## Notes
1. All endpoints require authentication
2. Create, Update, and Delete operations require the `manage-academic-years` permission
3. Academic years must have unique labels
4. An academic year cannot be deleted if it has associated books or subjects
5. Academic years can be associated with multiple branches, subjects, and chapters

# Branch Management APIs

## Overview
These endpoints handle branch (stream) management operations. Branches can be categorized into groups (e.g., MPC, BiPC under General group).

## Endpoints

### 1. Get All Branches
- **URL**: `/api/branches`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves all branches in the system
- **Query Parameters**: 
  - `academicYearcode` (optional): Filter branches by academic year code
- **Response Format**:
  ```json
  [
    {
      "id": 1,
      "name": "MPC",
      "branchCode": "MPC001",
      "createdAt": "2025-05-17T10:00:00.000Z",
      "groupId": 2,
      "group": {
        "id": 2,
        "name": "General"
      },
      "years": [
        {
          "id": 1,
          "label": "1st year",
          "code": "1_year"
        }
      ]
    }
  ]
  ```

### 2. Get Branch by ID
- **URL**: `/api/branches/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves a specific branch by its ID
- **URL Parameters**:
  - `id`: The numeric ID of the branch (required)
- **Response Format**:
  ```json
  {
    "id": 1,
    "name": "MPC",
    "branchCode": "MPC001",
    "createdAt": "2025-05-17T10:00:00.000Z",
    "groupId": 2,
    "group": {
      "id": 2,
      "name": "General"
    },
    "years": [
      {
        "id": 1,
        "label": "1st year",
        "code": "1_year"
      }
    ],
    "subjects": [
      {
        "id": 1,
        "name": "Mathematics",
        "code": "MATH101"
      }
    ]
  }
  ```
- **Error Responses**:
  ```json
  {
    "error": "Branch not found"
  }
  ```
  Status Code: 404
  
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

### 3. Get Branches by Group
- **URL**: `/api/branches/group/:groupId`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves all branches belonging to a specific group
- **URL Parameters**:
  - `groupId`: The numeric ID of the group (required)
- **Query Parameters**: 
  - `academicYearcode` (optional): Filter branches by academic year code
- **Response Format**: Same as Get All Branches

### 3. Create Branch
- **URL**: `/api/branches`
- **Method**: `POST`
- **Authentication**: Required
- **Permission Required**: `manage-branches`
- **Request Body**:
  ```json
  {
    "name": "MPC",
    "academicYearIds": [1, 2],
    "groupId": 2
  }
  ```
- **Response Format**:
  ```json
  {
    "id": 1,
    "name": "MPC",
    "branchCode": null,
    "createdAt": "2025-05-17T10:00:00.000Z",
    "groupId": 2,
    "years": [
      {
        "id": 1,
        "label": "1st year",
        "code": "1_year"
      }
    ]
  }
  ```
- **Error Responses**:
  ```json
  {
    "error": "Branch already exists"
  }
  ```
  Status Code: 400

### 4. Update Branch
- **URL**: `/api/branches/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Permission Required**: `manage-branches`
- **Request Body**:
  ```json
  {
    "name": "MPC Updated",
    "branchCode": "MPC001",
    "academicYearIds": [1, 2]
  }
  ```
- **Response Format**: Same as Create Branch response
- **Error Responses**:
  ```json
  {
    "error": "Branch name already exists"
  }
  ```
  or
  ```json
  {
    "error": "Branch code already exists"
  }
  ```
  Status Code: 400

### 5. Delete Branch
- **URL**: `/api/branches/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Permission Required**: `manage-branches`
- **Description**: Deletes a branch if it's not being used
- **Response Format**:
  ```json
  {
    "message": "Branch deleted successfully"
  }
  ```
- **Error Responses**:
  ```json
  {
    "error": "Cannot delete branch as it is being used by books, subjects, or users"
  }
  ```
  Status Code: 400

## Schema Information
Branches are defined in the database with the following structure:
```prisma
model Branch {
  id         Int            @id @default(autoincrement())
  name       String         @unique
  branchCode String?        @unique
  createdAt  DateTime       @default(now())
  group      Group?         @relation(fields: [groupId], references: [id])
  groupId    Int?
  users      User[]
  books      Book[]
  years      AcademicYear[] @relation("AcademicYearToBranch")
  subjects   Subject[]      @relation("BranchToSubject")
}
```

## Notes
1. All endpoints require authentication
2. Create, Update, and Delete operations require the `manage-branches` permission
3. A branch cannot be deleted if it has associated books, subjects, or users
4. Branch names and branch codes must be unique
5. Branches can be associated with multiple academic years
6. Each branch belongs to a group (e.g., Vocational or General)

# Subject Management APIs

## Overview
These endpoints handle subject management operations. Subjects can be associated with branches, academic years, and books.

## Required Permissions
- `add-subjects`: Required for creating subjects
- `edit-subjects`: Required for updating subjects
- `delete-subjects`: Required for deleting subjects
- No specific permission required for viewing subjects

## Endpoints

### 1. Get All Subjects
#### a. Get All Subjects (No Filter)
- **URL**: `/api/subjects`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves all non-deleted subjects in the system
- **Query Parameters**: None
- **Response Format**:
  ```json
  [
    {
      "id": 1,
      "name": "Mathematics",
      "type": "theory",
      "branch": [...],
      "academicYear": [...],
      "books": [...]
    }
  ]
  ```

#### b. Get Subjects by Branch
- **URL**: `/api/subjects`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves subjects filtered by branch ID
- **Query Parameters**:
  - `branchId` (required): The numeric ID of the branch to filter by
- **Response Format**: Same as above

#### c. Get Subjects by Academic Year
- **URL**: `/api/subjects`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves subjects filtered by academic year code
- **Query Parameters**:
  - `academicYearCode` (required): The code of the academic year to filter by (e.g., "1_year")
- **Response Format**: Same as above

#### d. Get Subjects by Branch and Academic Year
- **URL**: `/api/subjects`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves subjects filtered by both branch ID and academic year code
- **Query Parameters**:
  - `branchId` (required): The numeric ID of the branch to filter by
  - `academicYearCode` (required): The code of the academic year to filter by
- **Response Format**: Same as above

- **Error Response for all variants**:
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

  ```json
  {
    "error": "Invalid branch ID"
  }
  ```
  Status Code: 400

  ```json
  {
    "error": "Invalid academic year code"
  }
  ```
  Status Code: 400

### 2. Create Subject
- **URL**: `/api/subjects`
- **Method**: `POST`
- **Authentication**: Required
- **Permission Required**: `add-subjects`
- **Description**: Creates a new subject with optional associations to branches, academic years, and books
- **Request Body**:
  ```json
  {
    "name": "Physics",
    "type": "theory",
    "branchIds": [1, 2],
    "academicYearIds": [1],
    "bookIds": [1, 2]
  }
  ```
- **Response Format**:
  ```json
  {
    "id": 1,
    "name": "Physics",
    "type": "theory",
    "branch": [...],
    "academicYear": [...],
    "books": [...]
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Subject already exists"
  }
  ```
  Status Code: 400

### 3. Update Subject
- **URL**: `/api/subjects/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Permission Required**: `edit-subjects`
- **Description**: Updates an existing subject and its associations
- **URL Parameters**:
  - `id`: The numeric ID of the subject
- **Request Body**: Same as Create Subject
- **Response Format**: Same as Create Subject response
- **Error Response**:
  ```json
  {
    "error": "Server error"
  }
  ```
  Status Code: 500

### 4. Delete Subject
- **URL**: `/api/subjects/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Permission Required**: `delete-subjects`
- **Description**: Soft deletes a subject if it has no associated chapters
- **URL Parameters**:
  - `id`: The numeric ID of the subject
- **Response Format**:
  ```json
  {
    "message": "Subject deleted successfully"
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Cannot delete subject as it has associated chapters"
  }
  ```
  Status Code: 400

### 5. Get Subject Chapters
- **URL**: `/api/subjects/:subjectId/chapters`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves chapters for a specific subject and generates a PDF with QR codes
- **URL Parameters**:
  - `subjectId`: The numeric ID of the subject
- **Query Parameters**:
  - `branchId` (optional): Filter by branch ID
  - `academicYearId`: Academic year ID (required)
- **Response**: PDF file containing subject chapters with QR codes
- **Error Response**:
  ```json
  {
    "error": "Subject not found"
  }
  ```
  Status Code: 404

### 6. Upload Subject File (DEPRECATED)
- **URL**: `/api/subjects/upload`
- **Method**: `POST`
- **Authentication**: Required
- **Permission Required**: `add-subjects`
- **Description**: Creates a subject and chapters from an uploaded PDF or Excel file
- **⚠️ WARNING: This endpoint is deprecated and needs improvement**
- **Request Body**:
  - Content-Type: multipart/form-data
  - Fields:
    - `file`: PDF or Excel file (max 10MB)
    - `academicYearId`: Academic year ID
    - `year`: Year
    - `book`: Book ID (optional)
- **Response Format**:
  ```json
  {
    "subject": {...},
    "chapters": [...]
  }
  ```
- **Error Responses**:
  ```json
  {
    "message": "No file uploaded"
  }
  ```
  Status Code: 400
  ```json
  {
    "message": "No chapters found in the file"
  }
  ```
  Status Code: 400

## Schema Information
Subjects are defined in the database with the following structure:
```prisma
model Subject {
  id           Int           @id @default(autoincrement())
  name         String
  type         String?
  isDeleted    Boolean       @default(false)
  deletedAt    DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  userId       Int
  createdById  Int
  updatedById  Int
  books        Book[]
  branch       Branch[]      @relation("BranchToSubject")
  academicYear AcademicYear[] @relation("AcademicYearToSubject")
  chapters     Chapter[]
}
```

## Notes
1. All endpoints require authentication
2. CRUD operations require specific permissions
3. The upload endpoint is deprecated and needs improvement:
   - File processing reliability issues
   - Limited validation of file contents
   - No proper error handling for malformed files
   - Potential performance issues with large files
4. Subjects can be associated with multiple branches and academic years
5. Soft delete is implemented to preserve data integrity
6. QR code generation is automatic for chapters
7. File upload supports only PDF and Excel formats with 10MB limit

# Book Management APIs

## Overview
These endpoints handle book management operations. Books can be associated with branches, academic years, and subjects. Each book has a unique QR code for identification.

## Required Permissions
- `add-books`: Required for creating books
- `edit-books`: Required for updating books
- `delete-books`: Required for deleting books
- No specific permission required for viewing books

## Endpoints

### 1. Get Books

#### a. Get All Books (No Filter)
- **URL**: `/api/books`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves all non-deleted books in the system
- **Query Parameters**: None
- **Response Format**:
  ```json
  [
    {
      "id": 1,
      "title": "Mathematics Volume 1",
      "description": "First year mathematics textbook",
      "publisher": "Board of Secondary Education",
      "bookCode": "MATH101",
      "qrCode": "unique-qr-code",
      "branchId": 1,
      "academicYearId": 1,
      "branch": {...},
      "academicYear": {...}
    }
  ]
  ```

#### b. Get Books by Subject
- **URL**: `/api/books`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves books filtered by subject ID
- **Query Parameters**:
  - `subjectId` (required): The numeric ID of the subject to filter by
- **Response Format**: Same as above

#### c. Get Books by Branch
- **URL**: `/api/books`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves books filtered by branch ID
- **Query Parameters**:
  - `branchId` (required): The numeric ID of the branch to filter by
- **Response Format**: Same as above

#### d. Get Books by Academic Year
- **URL**: `/api/books`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves books filtered by academic year code
- **Query Parameters**:
  - `academicYearCode` (required): The code of the academic year to filter by (e.g., "1_year")
- **Response Format**: Same as above

### 2. Get Book by ID
- **URL**: `/api/books/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves a specific book by its ID
- **URL Parameters**:
  - `id` (required): The numeric ID of the book
- **Response Format**:
  ```json
  {
    "id": 1,
    "title": "Mathematics Volume 1",
    "description": "First year mathematics textbook",
    "publisher": "Board of Secondary Education",
    "bookCode": "MATH101",
    "qrCode": "unique-qr-code",
    "branchId": 1,
    "academicYearId": 1,
    "branch": {...},
    "academicYear": {...},
    "subjects": [...]
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Book not found"
  }
  ```
  Status Code: 404

### 3. Get Book by QR Code
- **URL**: `/api/books/qr/:qr`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Retrieves a book by its QR code, including related chapters and sub-QR codes
- **URL Parameters**:
  - `qr` (required): The unique QR code of the book
- **Response Format**:
  ```json
  {
    "id": 1,
    "title": "Mathematics Volume 1",
    "qrCode": "unique-qr-code",
    "branch": {...},
    "academicYear": {...},
    "subjects": [
      {
        "id": 1,
        "name": "Mathematics",
        "chapters": [
          {
            "id": 1,
            "title": "Chapter 1",
            "subQRCodes": [...]
          }
        ]
      }
    ]
  }
  ```

### 4. Create Book
- **URL**: `/api/books`
- **Method**: `POST`
- **Authentication**: Required
- **Permission Required**: `add-books`
- **Description**: Creates a new book with specified associations
- **Request Body**:
  ```json
  {
    "title": "Mathematics Volume 1",
    "description": "First year mathematics textbook",
    "publisher": "Board of Secondary Education",
    "branchId": 1,
    "academicYearId": 1,
    "subjectIds": [1, 2],
    "bookCode": "MATH101" // optional
  }
  ```
- **Required Fields**: title, academicYearId, subjectIds (at least one)
- **Optional Fields**: description, publisher, branchId, bookCode
- **Response Format**: Same as Get Book by ID response
- **Error Responses**:
  ```json
  {
    "error": "Academic year not found"
  }
  ```
  Status Code: 404
  ```json
  {
    "error": "Please select at least one subject"
  }
  ```
  Status Code: 400
  ```json
  {
    "error": "Qr Code Already Generated"
  }
  ```
  Status Code: 200

### 5. Update Book
- **URL**: `/api/books/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Permission Required**: `edit-books`
- **Description**: Updates an existing book and its associations
- **URL Parameters**:
  - `id` (required): The numeric ID of the book
- **Request Body**: Same as Create Book
- **Response Format**: Same as Get Book by ID response
- **Error Responses**: Same as Create Book

### 6. Delete Book
- **URL**: `/api/books/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Permission Required**: `delete-books`
- **Description**: Soft deletes a book if it has no associated subjects
- **URL Parameters**:
  - `id` (required): The numeric ID of the book
- **Response Format**:
  ```json
  {
    "message": "Book deleted successfully"
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Cannot delete book as it has associated subjects"
  }
  ```
  Status Code: 400

## Schema Information
Books are defined in the database with the following structure:
```prisma
model Book {
  id            Int           @id @default(autoincrement())
  title         String
  description   String?
  publisher     String?
  bookCode      String?       @unique
  qrCode        String        @unique
  isDeleted     Boolean       @default(false)
  deletedAt     DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  branchId      Int?
  academicYearId Int?
  userId        Int
  createdById   Int
  updatedById   Int
  branch        Branch?       @relation(fields: [branchId], references: [id])
  academicYear  AcademicYear? @relation(fields: [academicYearId], references: [id])
  subjects      Subject[]
}
```

## Notes
1. All endpoints require authentication
2. Create, Update, and Delete operations require specific permissions
3. Books can be filtered by subject, branch, and academic year
4. Each book has a unique QR code and optional book code
5. Soft delete is implemented to preserve data integrity
6. Book codes are auto-generated if not provided
7. Books must have at least one associated subject
8. QR codes are automatically generated during book creation