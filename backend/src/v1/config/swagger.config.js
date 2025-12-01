import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jain Education Platform API",
      version: "1.0.0",
      description:
        "Complete API documentation for Jain Education Platform with courses, payments, and student management",
      contact: {
        name: "Jain Academy",
        email: "support@jainacademy.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development Server",
      },
      {
        url: "https://api.jainacademy.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Token from login/signup endpoint",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User unique identifier",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            name: {
              type: "string",
              description: "User full name",
            },
            class: {
              type: "string",
              description: "Student class or grade",
            },
            phone: {
              type: "string",
              description: "User phone number",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Course: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Course unique identifier",
            },
            subject: {
              type: "string",
              description: "Course subject name",
            },
            subject_class: {
              type: "string",
              description: "Course class/grade level",
            },
            description: {
              type: "string",
              description: "Course description",
            },
            tags: {
              type: "string",
              description: "Course tags (comma separated)",
            },
            is_free: {
              type: "boolean",
              description: "Whether course is free or paid",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            amount: {
              type: "number",
              format: "decimal",
              description: "Original amount",
            },
            discount_amount: {
              type: "number",
              format: "decimal",
              description: "Discount amount applied",
            },
            appliedPromo: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "Promo code used",
                },
                discountPercent: {
                  type: "number",
                  description: "Discount percentage",
                },
              },
            },
            status: {
              type: "string",
              enum: ["pending", "paid", "failed"],
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Student login, signup, and profile management",
      },
      {
        name: "Courses",
        description: "Course management and access",
      },
      {
        name: "Payments",
        description: "Payment processing and orders",
      },
    ],
  },
  apis: [
    "./src/v1/features/auth/routes/auth.route.js",
    "./src/v1/features/course/routes/course.route.js",
    "./src/v1/features/payment/routes/payment.route.js",
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
