export type SingleRedis = {
  node: string,
  password: string
}

export type ClusterRedis = {
  nodes: Array<string>,
  password: string
}