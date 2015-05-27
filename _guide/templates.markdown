---
layout: guide
title:  "Templates"
aside_order: 4
submenu:
  HTMLBars: "#htmlbars"
  Helpers:
    - "#helpers"
    - If: "#if"
      Each: "#each"
      "@component": "#component"
  Context: "#context"
---



##HTMLBars

Para el templating, JSkeleton utiliza [HTMLBars](https://github.com/tildeio/htmlbars), una capa creada sobre [Handlebars](http://handlebarsjs.com/) que nos permite compilar un DOM en vez de un String.

De este modo, se puede cambiar el comportamiento de los helpers en función de su contexto (sabiendo que están en un tag determinado, en un atributo, etc.).

Además, el uso de HTMLBars supone una mejora respecto al rendimiento en el renderizado de los templates, como puedes ver en [esta comparativa](http://jonathan-jackson.net/htmlbar-chart/).

##Helpers

###If

Puedes utilizar {% raw %}`{{#if }}`{% endraw %} para añadir bloques de forma condicional.

{% highlight html %}

<!-- HTMLBars template -->
{% raw %}
<div>
{{#if context.isPromise }}
<span> spinner </span>
{{else}}
<span> Listado de libros: </span>
{{/if}}
</div>
{% endraw %}

<!-- isPromise = true -->
<div>
<span> spinner </span>
</div>

<!-- isPromise = false -->
<div>
<span> Listado de libros: </span>
</div>
{% endhighlight %}

También se puede utilizar {% raw %} `{{if }}` {% endraw %} para añadir una condición en linea para manejar atributos de elementos del DOM.

{% highlight html %}

<!-- HTMLBars template -->
{% raw %}
<strong  class="{{if assertion 'result' 'alternative'}}">
{% endraw %}

<!-- assertion = true -->
<strong  class="result">

<!-- assertion = false -->
<strong  class="alternative">
{% endhighlight %}

###Each

{% highlight html %}

<!-- HTMLBars template -->
{% raw %}
{{#each "model" in context.bookCollection}}
<span>
    Titulo del libro: {{model.title}}
    Posicion en el listado: {{model.count}}
</span>
{{/each}}
{% endraw %}

{% endhighlight %}

###@component

Los helper `@component` nos permiten renderizar componentes dentro de un template:

{% highlight html %}

{% raw %}
{{@component 'ViewComponent' model=context.model}}
{% endraw %}

{% endhighlight %}

##Context

En el template tendremos acceso total al contexto creado en el ViewController y a sus modelos y colecciones.

{% highlight javascript %}

Jskeleton.ViewController.factory('MyViewController', function(_channel) {
        myHandlerMethod: function(routeParams, context){
            context.myModel = new Backbone.Model({
                title: routeParams.title,
            });
        }
    });

{% endhighlight %}

{% highlight html %}

{% raw %}
<div> {{ context.myModel }} </div>
{% endraw %}

{% endhighlight %}
