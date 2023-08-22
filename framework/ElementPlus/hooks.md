# Hooks 笔记

## useAttrs

这个 hook 用于传递全局属性。
fromPairs 其实可以用 `object.fromEntries` 代替。是 vue 中 `useAttrs` 的实现。

## useCursor

TODO: 这个 hook 没太看懂，主要对 setSelectionRange 这个 api 不太熟。

## useDeprecated

这个 hook 用来检测某个 API、属性、事件或者插槽当前版本是否已经不适用并发出警告。

## useDraggable

这个 hook 用来处理元素的拖拽。参数 1 是目标元素 ref 值，参数 2 是被拖拽的元素 ref 值，参数 3 是是否可拖拽。主要是用在 message-box 和 modal 里来处理整个 modal 或者 message-box 的拖拽。

TODO: 为何不直接使用原生拖拽事件？

## useFocus

这个 hook 是使页面 focus 到当前元素，传入的必须是个 ref 响应对象，我们可以利用它返回的 focus 函数轻松调用。

## useForwardRef

这个 hook 可能是类似 react 中 forwardRef 的作用。

## useId

随机生成 id，没看懂有什么作用。

## useLocale

这个 hook 很明显是用来处理 i18n 的，是一个简易版本的 `vue-i18n` 实现，实际项目中我们一般使用 `vue-i18n` 处理国际化。
但是其实现思路值得借鉴。具体代码如下：

```typescript
import { computed, inject, isRef, ref, unref } from 'vue'
import { get } from 'lodash-unified'
import English from '@element-plus/locale/lang/en'

import type { MaybeRef } from '@vueuse/core'
import type { InjectionKey, Ref } from 'vue'
import type { Language } from '@element-plus/locale'

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export type LocaleContext = {
  locale: Ref<Language>
  lang: Ref<string>
  t: Translator
}

export const buildTranslator =
  (locale: MaybeRef<Language>): Translator =>
  (path, option) =>
    translate(path, option, unref(locale))

export const translate = (
  path: string,
  option: undefined | TranslatorOption,
  locale: Language
): string =>
  (get(locale, path, path) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )

export const buildLocaleContext = (
  locale: MaybeRef<Language>
): LocaleContext => {
  const lang = computed(() => unref(locale).name)
  const localeRef = isRef(locale) ? locale : ref(locale)
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale),
  }
}

export const localeContextKey: InjectionKey<Ref<Language | undefined>> =
  Symbol('localeContextKey')

export const useLocale = (localeOverrides?: Ref<Language | undefined>) => {
  const locale = localeOverrides || inject(localeContextKey, ref())!
  return buildLocaleContext(computed(() => locale.value || English))
```

## useModal

这个 hook 是用于处理 modal 的显隐，并且在点击 ESC 键时，自动关闭顶层 modal。个人觉得实用价值不太高，但关闭顶层 modal 的思路值得学习下。

## useProp

这个 hook 的作用是提取当前组件的 prop 的某个属性作为 computed 对象。
主要涉及到 `getCurrentInstance` 这个 API ，个人感觉这个 hook 没有太大的使用价值，因为如果是需要解构的场景，完全可以使用 `[toRef](https://cn.vuejs.org/api/composition-api-setup.html#accessing-props)`[ 和 ](https://cn.vuejs.org/api/composition-api-setup.html#accessing-props)`[toRefs](https://cn.vuejs.org/api/composition-api-setup.html#accessing-props)` 函数来替代。

## useGlobalSize

这个 hook 用来在当前组件中获取全局 size 参数且只读。主要的知识点是 vue 核心库中 `inject` 的使用。

## useTeleport

这个 hook 的作用在**客户端**的组件中轻松将 vnode 的内容添加到 Teleport 中，轻松创建模态框等，并且在当前组件卸载时自动销毁隐藏元素。如果在服务端不会实际渲染。
主要涉及到 vue 的 `[Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html)`[ 组件](https://cn.vuejs.org/guide/built-ins/teleport.html) 以及 `[h](https://cn.vuejs.org/api/render-function.html#h)`[ 函数](https://cn.vuejs.org/api/render-function.html#h) 以及 `vueuse` 中的 `isClient` 方法。

`isClient` 的实现非常简单：

```typescript
export const isClient = typeof window !== "undefined";
```

## useThrottleRender

这个 hook 用于骨架屏渲染延迟。

## useTimeout

这个 hook 用于在 window 中安全地注册延时函数，并在作用域销毁的同时安全地销毁 `setTimeout`，以避免作用域销毁时用户忘记清除宏任务造成内存溢出。
这个 hook 的核心使用了 `window.setTimeout` 和 `@vueuse/core` 中的 `tryOnScopeDispose` 函数。实际上 `tryOnScopeDispose` 只是对 `vue` 核心库中的 `getCurrentScope` 和 `onScopeDispose` 两个 API 的简单封装。

- [getCurrentScope](https://cn.vuejs.org/api/reactivity-advanced.html#getcurrentscope): 如果有的话，返回当前活跃的 effect 作用域。
- [onScopeDispose](https://cn.vuejs.org/api/reactivity-advanced.html#onscopedispose): 在当前活跃的 effect 作用域上注册一个处理回调函数。当相关的 effect 作用域停止时会调用这个回调函数。这个方法可以作为可复用的组合式函数中 `onUnmounted` 的替代品，它并不与组件耦合，因为每一个 Vue 组件的 setup() 函数也是在一个 effect 作用域中调用的。
