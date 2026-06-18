import { AlignGroup } from '../types'

export function groupBy<Item, Info = undefined, Meta = undefined>(
  arr: Item[],
  isSameGroup: (
    prev: { item: Item; info: Info },
    cur: { item: Item; info: Info },
    prevAlignGroup: AlignGroup<Item, Info, Meta>,
  ) => any,
  options?: {
    initGroup?: () => Meta
    initItemInfo?: (item: Item) => Info
    onEnterGroup?: (
      v: { item: Item; info: Info },
      idx: number,
      alignGroup: AlignGroup<Item, Info, Meta>,
    ) => void
    filter?: (item: Item) => any
    minGroupSize?: number
  },
): AlignGroup<Item, Info, Meta>[] {
  type ItemWithInfo = { item: Item; info: Info }

  const {
    filter,
    minGroupSize = 2,
    onEnterGroup,
    initGroup,
    initItemInfo,
  } = options || {}

  const result: AlignGroup<Item, Info, Meta>[]   = []
  let lastValidItemWithInfo: ItemWithInfo | null = null
  let alignGroup: AlignGroup<Item, Info, Meta>

  const createNewGroup = (itemWithInfo?: ItemWithInfo) => {
    alignGroup = {
      list: [],
      meta: initGroup?.() as Meta,
    }
    if (itemWithInfo) {
      alignGroup.list.push(itemWithInfo)
      onEnterGroup?.(itemWithInfo, alignGroup.list.length - 1, alignGroup)
    }
  }

  const pushGroupIfValid = (itemWithInfo?: ItemWithInfo) => {
    if (alignGroup.list.length >= minGroupSize) {
      result.push(alignGroup)
    }
    lastValidItemWithInfo = null
    createNewGroup(itemWithInfo)
  }

  createNewGroup()

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    if (filter && !filter(item)) {
      if (alignGroup!.list.length > 0) pushGroupIfValid()
      continue
    }

    const itemWithInfo = { item, info: initItemInfo?.(item) as Info }

    if (lastValidItemWithInfo === null) {
      createNewGroup(itemWithInfo)
    } else {
      if (isSameGroup(lastValidItemWithInfo, itemWithInfo, alignGroup!)) {
        alignGroup!.list.push(itemWithInfo)
        onEnterGroup?.(itemWithInfo, alignGroup!.list.length - 1, alignGroup!)
      } else {
        pushGroupIfValid(itemWithInfo)
      }
    }
    lastValidItemWithInfo = itemWithInfo
  }

  // 处理最后一组
  if (alignGroup!.list.length > 0) pushGroupIfValid()

  return result
}
