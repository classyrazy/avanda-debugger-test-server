import { Middleware, Request, Response } from "@avanda/http";
import Wallet from "../../models/Wallet";

export default class implements Middleware{
    boot(res: Response, req: Request){

        return req.validate((Rule) => ({
            amount: new Rule().required().custom( async (amount, key) => {
                let user_id = req.getAttrs<number>('user_id')
                let wallet = await new Wallet().ofUserId(user_id).first()

                if (!wallet)
                    return "Sorry, we couldn't locate your wallet, please contact admin"

                amount = parseFloat(amount)

                if (amount < 0 || !amount)
                    return "Invalid amount"

                if (amount > wallet.balance)
                    return "Insufficient balance cover this amount"

                return true
            }),
        }))
    }
}