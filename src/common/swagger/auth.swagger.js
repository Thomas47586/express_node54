export const auth = {
  "/auth/get-info": {
    get: {
      tags: ["Auth"],
      summary: "Returns a list of user.",
      description: "Optional extended description in CommonMark or HTML.",

      responses: {
        200: {
          description: "Ok",
        },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      description: "Optional extended description in CommonMark or HTML.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "long1@gmail.com",
                },
                password: {
                  type: "string",
                  example: "12345",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Ok",
        },
      },
    },
  },
};
