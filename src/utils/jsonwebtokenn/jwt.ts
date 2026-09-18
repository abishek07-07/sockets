import jwt from "jsonwebtoken"

export interface TokenRequest {
  email: string,
  uid : string ,
}

export const encodeToken =   (data :TokenRequest )=> {

  return  jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN as string),
    algorithm: "HS512",
    audience: process.env.JWT_AUDIENCE as string,
    issuer : process.env.JWT_ISSUER as string
  })

}

export const decodeToken = (token: string)=> {

  if (token == null) throw new Error('Invalid token  ');

  return jwt.verify(token, process.env.JWT_SECRET as string, {
    algorithms: ["HS512"],
    audience: process.env.JWT_AUDIENCE as string,
    issuer : process.env.JWT_ISSUER as string
  });

}
