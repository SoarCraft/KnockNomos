import { useMount } from "ahooks";
import { ReactNode, createContext, useContext, useState } from "react";

/**
 * @author Aloento
 * @since 0.1.0
 * @version 1.0.0
 */

/**
 * 拼接Url并消除多余的斜杠
 *
 * @param paths
 */
function combineUrl(paths: readonly any[]): string {
  const p = paths
    .filter(x => x)
    .map(x => x!.toString().replace(/^\/+/, ""))
    .join("/");

  return `/${p}`;
}

/**
 * @author Aloento
 * @since 0.1.0
 * @version 1.0.0
 */
interface IRouter {
  Paths: readonly string[],
  Search: URLSearchParams,
  readonly Put: (search: URLSearchParams) => void,
  readonly Nav: (...paths: readonly any[]) => void,
  readonly Rep: (...paths: readonly any[]) => void,
  readonly Reload: (...paths: readonly any[]) => void,
}

/**
 * 路由方法
 *
 * @author Aloento
 * @since 0.1.0
 * @version 1.0.0
 */
const Router = createContext({} as IRouter);

/**
 * 上下文更新路由信息
 *
 * @author Aloento
 * @since 0.1.0
 * @version 1.0.0
 */
export function useRouter() {
  return useContext(Router);
}

/**
 * 根据路径解析路由并刷新组件
 * 
 * @author Aloento
 * @since 0.1.0
 * @version 1.0.0
 */
export function BrowserRouter({ children }: { children: ReactNode }): ReactNode {
  const [router, setRouter] = useState<IRouter>(() => ({
    // 解析当前路径
    Paths: location.pathname.split("/").filter(x => x),
    // 获取查询入参
    Search: new URLSearchParams(location.search),
    Put: put,
    Nav: (...p) => nav(combineUrl(p)),
    Rep: (...p) => replace(combineUrl(p)),
    Reload: (...p) => reload(p),
  }));

  function put(search: URLSearchParams) {
    // 替换新路由条目
    history.replaceState(null, "", `${location.pathname}${search.size ? "?" : ""}${search.toString()}`);
    router.Search = new URLSearchParams(search);
    // 触发重新渲染
    setRouter({ ...router });
  }

   * 刷新页面
   * @param path
   */
  function update(path: string) {
    router.Paths = path.split("/").filter(x => x);
    router.Search = new URLSearchParams(location.search);
    setRouter({ ...router });
  }

  function nav(path: string) {
    history.pushState(null, "", path);
    update(path);
  }

  function replace(path: string) {
    history.replaceState(null, "", path);
    update(path);
  }

  /**
   * 重载页面：访问Reload路径后，访问目标路径
   * @param paths 重载路径
   */
  function reload(paths: readonly string[]) {
    history.replaceState(null, "", "/Reload");
    update("/Reload");

    setTimeout(() => {
      const path = paths.length ? combineUrl(paths) : location.pathname;
      history.pushState(null, "", path);
      update(path);
    }, 100);
  }

  /**
   * 组件挂载初始化逻辑
   */
  useMount(() => {
    // ?/路径数据清除
    if (location.pathname === "/")
      if (location.search.startsWith("?/"))
        replace(location.search.substring(2));


    addEventListener("click", e => {
      // 外部网站跳转校验
      const target = (e.target as HTMLElement)?.closest("a");
      if (target) {
        // 禁止外部网站跳转
        if (target.origin !== location.origin) {
          target.target = "_blank";
          return;
        }
        
        // 阻止浏览器默认操作
        e.preventDefault();
        // 刷新组件并压栈
        nav(target.pathname);
      }
    });

    addEventListener("popstate", e => {
      e.preventDefault();
      update(location.pathname);
    });
  });

  return (
    <Router.Provider value={router}>
      {children}
    </Router.Provider>
  );
}
