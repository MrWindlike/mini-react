import {
  isDef
} from './utils'

class Event {
  private readonly map: Record<string, Function[]> = {}

  public on (name: string, handle: Function): void {
    if (isDef(this.map[name])) {
      this.map[name].push(handle)
    } else {
      this.map[name] = [handle]
    }
  }

  public off (name: string, handle: Function): void {
    const handlers = this.map[name] ?? []

    this.map[name] = handlers.filter((fn) => fn !== handle)
  }

  public emit (name: string, ...params: unknown[]): void {
    const handlers = this.map[name] ?? []

    handlers.forEach((handle) => { handle(...params) })
  }
}

export default new Event()
