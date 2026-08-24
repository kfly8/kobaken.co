'use client'

export const ToggleTheme = () => {
  return (
    <>
      {/* data-bf-permanent: script.js attaches its click listener to this
          node once, on initial page load. The region is rebuilt on every
          Router navigation, so without this the button would be replaced
          by a lookalike with no listener attached — clicks after the
          first navigation would silently do nothing. */}
      <div id="toggle-theme" data-bf-permanent="toggle-theme">
        <i className="switch-dark icon-moon"></i>
        <i className="switch-light icon-sun"></i>
      </div>
    </>
  )
}
