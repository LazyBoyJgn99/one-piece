import { Application, Container, Graphics } from "pixi.js";
import { useEffect } from "react";

export type GameObjProps = { app: Container, children: typeof GameObj | typeof GameObj[] } & Graphics

export default function GameObj({ app, children, ...rest }: GameObjProps) {
    const myObj = new Graphics()
    if (!children) {
        return null
    }

    useEffect(() => {
        myObj.clear()
        const keys = Object.keys(rest);
        keys.map((item) => {
            // @ts-ignore 
            myObj[item] = rest[item]
            return null
        })
        app.addChild(myObj);
    }, [])
    useEffect(() => {
        myObj.clear()
        const keys = Object.keys(rest);
        keys.map((item) => {
            // @ts-ignore 
            myObj[item] = rest[item]
            return null
        })
        // @ts-ignore
    }, [...rest])

    if (Array.isArray(children)) {
        return <>
            {
                children.map(item => {
                    myObj.addChild(item)
                    return item
                })
            }
        </>
    }
    myObj.addChild(children)
    return <>{children}</>;
}
