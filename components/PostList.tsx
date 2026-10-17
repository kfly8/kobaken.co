import { Layout } from './Layout'
import { PostTags } from './PostTags'
import type { Post } from '../content/posts'
import { type Lang, LANG_NAME_IN, localized, languageMenu } from '../i18n'

interface PostListProps {
  posts: Post[]
  lang: Lang
  // '/blog' or '/diary', without the language.
  section: string
  heading: string
  emptyText: string
  // The list's path without the language, when it is not the section's
  // own (a tag's list).
  path?: string
}

export function PostList(props: PostListProps) {
  const menu = languageMenu(props.path ?? props.section, props.lang)
  return (
    <Layout
      className="blog-list"
      lang={props.lang}
      active={props.section === '/diary' ? 'diary' : 'blog'}
      menu={menu}
    >
      <h1>{props.heading}</h1>
      {props.posts.length === 0 ? (
        <p className="empty">{props.emptyText}</p>
      ) : (
        <ul>
          {props.posts.map((post) => (
            // A post not yet in this list's language is listed in its own,
            // and says so: its title and description are in that language.
            <li key={post.slug} lang={post.lang === props.lang ? undefined : post.lang}>
              <div className="row">
                <span className="date">{post.date}</span>
                <span className="title">
                  <a href={localized(`${props.section}/${post.slug}`, post.lang)}>{post.title}</a>
                  {post.lang === props.lang ? null : <span className="post-lang"> ({LANG_NAME_IN[props.lang][post.lang]})</span>}
                </span>
              </div>
              {post.description && <p className="description">{post.description}</p>}
              {post.tags.length > 0 && (
                <div className="tags"><PostTags tags={post.tags} basePath={localized(props.section, props.lang)} /></div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  )
}
