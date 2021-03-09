export type RegisterSWOptions = {
  auto?: boolean
  immediate?: boolean
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
}
