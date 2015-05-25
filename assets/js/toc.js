(function($) {
  /**
   * Custom TOC to Jskeleton DOC
   * @param  {Object} options CSS classes, submenu Object,...
   */
  $.fn.toc = function(options) {
    var settings = {
      submenu: options.submenu,
      asideActiveId: options.asideActive || "active-menu-li",
      asideClasses: {
        ul: options.asideUl || "",
        li: options.asideLi || "aside-subnav__item",
        a: options.asideA || "class-link-aside"
      },
      textClasses: {
        ul: options.textUl || "",
        li: options.textLi || "",
        a: options.textA || "class__link--index"
      },
    },
    asideUl = document.createElement("ul"),
    textUl,
    li,
    anchor;

  $.each(settings.submenu, function(key,value){
      if (typeof value === "string"){
        createLi(key, value, asideUl, settings.asideClasses);
      }else{
        createLi(key, value[0], asideUl, settings.asideClasses);

        textUl = document.createElement("ul");

        $.each(value[1], function(textKey,textValue){
            createLi(textKey, textValue, textUl, settings.textClasses);
        });
        $(value[0]).after(textUl);
      }
    document.getElementById(settings.asideActiveId).appendChild(asideUl);
  });

  /**
   * Creates a new li DOM node, populate it & append it to a ul
   * @param  {String} html    Text to include in the anchor
   * @param  {String} href    Href to include in the anchor
   * @param  {Object} ul      Ul DOM node
   * @param  {Object} classes CSS classes
   */
  function createLi(html, href, ul, classes){
      li = document.createElement("li");
      anchor = document.createElement("a");

      anchor.setAttribute("href", href);
      anchor.innerHTML = html;

      asideUl.className = classes.ul;
      li.className = classes.li;
      anchor.className = classes.a;

      li.appendChild(anchor);

      ul.appendChild(li);
  };

  };

})(jQuery)
