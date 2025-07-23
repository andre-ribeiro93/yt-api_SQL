import { verify } from "jsonwebtoken"


const login = (req: any, res: any, next: any) => {
  try {
    const decode = verify(req.headers.authorization, process.env.SECRET as string); //descriptografando o token //
    req.user = decode;
    next(); //serve para dizer que caso o token estaja validado, deve-se dar continuidade no processo.
  } catch (error) {
    return res.status(401).json({message: 'Access denied!'})
  }
}

export { login };