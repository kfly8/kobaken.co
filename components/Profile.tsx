export const Profile = () => {
  return (
    <>
      <section className="flex items-center min-h-[100svh]">
          <img className="rounded-full w-20 h-20 object-cover inline-block mr-5" src="/static/img/kobaken.jpg" alt="icon" />
          <div>
            <h1>kobaken</h1>
            <ul className="mx-auto my-0 -ml-0.5">
              <li className="inline-block mr-4"><a href="https://github.com/kfly8"><i className="icon-github text-[32px]"></i><span className="sr-only">GitHub</span></a></li>
              <li className="inline-block mr-4"><a href="https://twitter.com/kfly8"><i className="icon-twitter text-[32px]"></i><span className="sr-only">Twitter</span></a></li>
              <li className="inline-block mr-4"><a href="mailto:kentafly88@gmail.com"><i className="icon-mail text-[32px]"></i><span className="sr-only">Mail</span></a></li>
            </ul>
          </div>
      </section>
    </>
  )
}

