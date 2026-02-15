import { createServer, dfdTools } from "staruml-controller-mcp-core"

export function createDfdServer() {
    return createServer("staruml-controller-dfd", "1.0.0", dfdTools)
}
