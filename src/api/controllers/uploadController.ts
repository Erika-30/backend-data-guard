import { Response, Request } from "express";
import csv from "csv-parser";
import { PassThrough } from "stream";
import { UserSchema } from "../../config/dbConfig";
import { createUser } from "../../services/auth.service";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadCsv = (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: false, message: "No file uploaded" });
  }

  const userPromises: any[] = [];
  const userListOk: FailureUserDto[] = [];
  const userListError: FailureUserDto[] = [];

  const bufferStream = new PassThrough();
  bufferStream.end(req.file.buffer);

  let rowNumber = 0;

  return bufferStream
    .pipe(
      csv({
        separator: ";",
        mapValues: ({ header, value }) => {
          if (header === "age") return parseInt(value);
          return value;
        },
      })
    )
    .on("data", (data) => {
      rowNumber++;
      data.rowNumber = rowNumber;

      const userData = new FailureUserDto();
      userData.username = data.username;
      userData.email = data.email;
      userData.age = data.age.toString();
      userData.role = data.role;
      userData.password = data.password;

      const validationResult = UserSchema.safeParse(userData);

      if (!validationResult.success) {
        userData.row = data.rowNumber;
        userData.details = validationResult.error.errors.map((error) => ({
          path: error.path[0] as string,
          message: error.message,
        }));
        userListError.push(userData);
      } else {
        const userPromise = createUser(userData)
          .then(() => {
            userListOk.push(userData);
          })
          .catch((error) => {
            userData.row = data.rowNumber;
            userData.details = [
              {
                path:
                  error.message === "Email already in use"
                    ? "email"
                    : "general",
                message: error.message,
              },
            ];
            userListError.push(userData);
          });
        userPromises.push(userPromise);
      }
    })
    .on("end", async () => {
      try {
        await Promise.all(userPromises);

        res.json({
          status: true,
          message: "Archivo CSV leído correctamente",
          data: {
            success: userListOk,
            errors: userListError,
          },
        });
      } catch (error: any) {
        res.status(500).json({
          status: false,
          message: "Error al crear usuarios: " + error.message,
        });
      }
    })
    .on("error", (error) => {
      res.status(500).json({
        status: false,
        message: "Error al leer el archivo CSV: " + error.message,
      });
    });
};

export const retryUser = async (req: Request, res: Response) => {
  const userData = req.body;

  const validationResult = UserSchema.safeParse(userData);

  if (!validationResult.success) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: validationResult.error.errors.map((error) => ({
        path: error.path[0] as string,
        message: error.message,
      })),
    });
  }

  try {
    const user = await createUser(userData);
    return res.json({
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
      errors: [
        {
          path: error.message === "Email already in use" ? "email" : "general",
          message: error.message,
        },
      ],
    });
  }
};

export class UserDto {
  username!: string;
  email!: string;
  age?: string;
  role!: string;
  password!: string;
}

export class FailureUserDto extends UserDto {
  row?: number;
  details!: PathErrorDto[];
}

export class PathErrorDto {
  path?: string;
  message?: string;
}
