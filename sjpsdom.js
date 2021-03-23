const SJPSDOM_EVENT = new CustomEvent("sjpsdom-event", {bubbles: true})

function getActiveEvents(element)
{
  // Finds the events of an element that are being listened to.
  // Returns a list of event names.
  const events = []
  for (const field in element)
  {
    if (field.startsWith('on') && element[field])
    {
      events.push(field)
    }
  }
  return events
}

function deepCopyWithJSON(object)
{
  // This function performs a JSON deep copy on an object.
  // It's good enough (but slow) when dealing with primitive types.
  // For complex types (dates etc.) something else should be used.
  return JSON.parse(JSON.stringify(object))
}

function deepEqual(object1, object2)
{
  // This function checks if two objects are equal.
  // This means that the both the keys and values should be equal.
  // Does it deeply!

  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length)
    return false

  function isObject(object)
  {
    return object !== null && typeof object === 'object'
  }

  for (const key of keys1)
  {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)

    if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2)
      return false
  }

  return true
}

function E$(name, attributes, ...children)
{
  // This function creates an element node.
  // Optional parameters are attributes, which should be an object,
  //  and children, a vararg list of other element nodes.
  //
  // Usage:
  //
  //  E$('div')
  //    => <div></div>
  //
  //  E$('div', {class: 'container'})
  //    => <div class="container"></div>
  //
  //  E$('div', 'Hello, world!')
  //    => <div>Hello, world!</div>
  //
  //  E$('div', {class: 'container'}, 'Hello, world!')
  //    => <div class="container">Hello, world!</div>
  //
  //  E$('div',
  //    E$('h1', 'My First App!'),
  //    E$('hr'),
  //    E$('p', {style: "font-weight: bold;"}, 'Hello, world!')
  //  )
  //

  // Let's make it easy for us.
  // The 'name' parameter must be a string.
  if (typeof name !== "string")
    throw TypeError("Element name must be a string!")

  // Our HTML element
  const e = document.createElement(name.toUpperCase())

  // Time to handle the 'attributes' parameter.
  // It could be many things...

  // If 'attributes' is a string, set it to the innerText
  //  attribute of the element.
  // Example: E$('p', 'Hello, world!', ...)
  if (typeof attributes === "string")
    e.innerText = attributes

  // If 'attributes' is a Node (aka. TextNode, ElementNode),
  //  then append it to the element.
  // Example: E$('div', E$('p'), ...)
  else if (attributes instanceof Node)
    e.appendChild(attributes)

  // If 'attributes' is an array (e.g. the result of using A$)
  //  then prepend it with the 'children' parameter.
  // In this case 'attributes' is the first of the children.
  else if (Array.isArray(attributes))
    children = attributes.concat(children)

  // The default case, 'attributes' is an object.
  // It's simple, we just go through the key-value pairs in the object,
  //  and set the attributes accordingly.
  else
  {
    for (let attributeName in attributes)
    {
      const attributeValue = attributes[attributeName]
      switch (attributeName)
      {
        // innerText and innerHTML have to be dealt with seperately.
        // TODO: Are you sure about that?
        case "innerText":
          e.innerText = attributeValue
          break
        case "innerHTML":
          e.innerHTML = attributeValue
          break
  
        default:
          // Events must be set a bit differently.
          // TODO: Is this the best way to figure out if the attributeName refers to an event?
          if (attributeName.startsWith("on"))
            e[attributeName] = attributeValue
          
          // The default case. Use the setAttribute method.
          else
            e.setAttribute(attributeName, attributeValue)
      }
    }
  }

  // The 'attributes' parameter has been dealt with.
  // Time to deal with the children!


  // If the first child is a string, set it to the innerText
  //  attribute of the element.
  if(children.length === 1 && typeof children[0] === "string")
    e.innerText = children[0]

  // Otherwise, let's assume that 'children' is a collection
  //  of other HTML nodes.
  else
  {
    for (let child of children)
    {
      // If the child is an array, then
      //  append the nodes of that array to the element.
      // TODO: We are assuming that the items in the array
      //  are valid HTML nodes!
      if (Array.isArray(child))
        for(let c of child)
          e.appendChild(c)

      // Otherwise just append the not null child to the element.
      // TODO: The type is not being checked!
      else if (child)
        e.appendChild(child)
    }
  }

  // Done, return built element
  return e
}

function T$(text)
{
  // This function creates a text node.
  // Shorthand for document.createTextNode(text)
  if (typeof text !== "string")
  {
    throw TypeError("Text node 'text' must be a string!")
  }
  return document.createTextNode(text)
}

function A$(items, func)
{
  // This function maps over items and returns a new array.
  // Essentially applies func on each item in items.
  // Shorthand for items.map(func).
  let result = []
  for (let i = 0; i < items.length; i++)
  {
    let item = items[i]
    result.push(func(item, i, items))
  }
  return result
}

function F$(items, func)
{
  // This function filters items and returns a new array.
  // Essentially applies func on each item in items.
  // Shorthand for items.filter(func).
  let result = []
  for (let i = 0; i < items.length; i++)
  {
    let item = items[i]
    if (func(item, i, items))
      result.push(item)
  }
  return result
}

function Q$(query, element)
{
  // This function is a simple shorthand function
  //  for querySelector.
  if (element && element instanceof Element)
  {
    return element.querySelector(query)
  }
  return document.querySelector(query) || null
}

function QA$(query, element)
{
  // This function is a simple shorthand function
  //  for querySelectorAll.
  if (element && element instanceof Element)
  {
    return element.querySelectorAll(query)
  }
  return document.querySelectorAll(query)
}

function V$(query, element)
{
  // This function gets the value of an element.
  // The target element is queried for within the element parameter.
  // If no element parameter is provided, the entire document will be queried.
  // Returns the value if it exists, otherwise returns null.
  let target
  if (element && element instanceof Element)
  {
    target = element.querySelector(query)
  }
  else
  {
    target = document.querySelector(query)
  }
  return target ? target.value : null
}

function ID$(id)
{
  // This function is a simple shorthand for
  //  document.getElementById
  return document.getElementById(id)
}

function SETE$(parent, child)
{
  // This function sets the HTML content of an element.
  // The existing content is wiped and forgotten.
  parent.innerHTML = null
  const nodes = Array.isArray(child) ? child : [child]
  for (const node of nodes)
    parent.appendChild(node)
}

async function INIT$(rootQuery, appViewDefinition, state)
{
  // This function initializes the entire sjpsdom app.
  // It prepares everything and does most of the leg work.
  // It adds event listeners to track the changing state.
  // It updates the DOM with new HTML elements whenever events are triggered and the state has changed.

  // state defaults to {}

  const rootElement = document.querySelector(rootQuery)

  if (!rootElement)
    throw Error("Could not find root element!")

  // These values can be changed by user input
  let currentState = {}

  if (state)
  {
    if (typeof init === "function")
      currentState = await state()
    else
      currentState = state
  }

  // These values track the previous state
  // TODO: Use a better solution than JSON deep copy
  let previousState = deepCopyWithJSON(currentState)

  // Handle class-based apps seperately
  if (!!appViewDefinition.toString().match(/^class/))
    return INIT_CLASS$(rootQuery, appViewDefinition)

  // Insert app view in the root element
  let appView = appViewDefinition(currentState, previousState, null)
  SETE$(rootElement, appView)

  //
  // Handle app view updates
  // Catch appElement events
  // Refresh view if state has changed
  //

  const refreshApp = () => {
    let activeElement = document.activeElement
    appView = appViewDefinition(currentState, previousState, appView)
    SETE$(rootElement, appView)
    activeElement.focus()
  }

  const stateChanged = () =>
    !deepEqual(currentState, previousState)

  const appEventHandler = event => {
    if (stateChanged())
    {
      refreshApp()
      previousState = deepCopyWithJSON(currentState)
      addAppElementEvents()
    }
  }

  const addAppElementEvents = () => {
    const appElements = rootElement.querySelectorAll("*")
    for (let e of appElements)
      for (let field in e)
        if(field.match(/^on\w+/))
          if (e[field] && !rootElement[field])
            rootElement[field] = appEventHandler
  }

  addAppElementEvents()

}

function IMPORT$(...sources)
{
  // This function imports local .js files to the application context.
  // New script elements are created in the head section of the DOM.
  // The created elements tagged with ids.
  // TODO: Wait for the scripts to load in this function instead of in LOAD$?
  if (Array.isArray(sources))
  {
    sources.forEach(function(source, index)
    {
      let id = 'sjpsdom_import_' + (++index)
      document.head.appendChild(
        E$('script', {id: id, src: source})
      )
    })
  }
}

function LOAD$(cb, onDomContentLoaded)
{
  // This function can take 1 or 2 functions as parameters.
  // If only one is provided, it is run on DOMContentLoaded.
  // If 2 are provided, the first is run immediately, second on DOMContentLoaded.

  // This function should be called like this:
  //  LOAD$(
  //    () => IMPORT$(...),
  //    () => INIT$(...)
  //  )
  //
  // This sets up the DOM and initializes the app

  if (cb)
  {

    if (onDomContentLoaded)
    {
      cb()

      document.addEventListener("DOMContentLoaded", async () => {

        // cb might import local JS files...
        // We need to wait for them to load before moving on.
        // Otherwise the views will break.

        // A simple sleep function
        function sleep(ms)
        {
          return new Promise(resolve => setTimeout(resolve, ms))
        }

        // A function that waits for scripts to load.
        // Waits 5 milliseconds at a time for at most 10 times.
        // After that the function gives up and logs an error.
        async function waitScriptLoad(scriptName, varName)
        {
          let attempts = 0
          while (eval(`typeof ${varName}`) === "undefined")
          {
            if (attempts++ >= 10) {
              console.error("sjpsdom import", scriptName, "failed! Did you forget to declare the variable",
                varName, "(initialized with a value) in", scriptName + ".js?")
              break
            }
            await sleep(5)
          }
        }

        // Loop through all the script elements.
        // Find the ones generated with IMPORT$()
        // Wait for them to load.
        for (let script of QA$("script"))
        {
          let match
          if (match = script.id.match(/^sjpsdom_import_\d+/))
          {
            let scriptName = script.src.match(/\/(\w+)\.js/)[1] // /path/to/(script).js
            let varName = scriptName + "_import"
            await waitScriptLoad(scriptName, varName)
          }
        }

        // The imported scripts have been loaded and are ready to use!
        // Call onDomContentLoaded.
        onDomContentLoaded()

      })
    }

    // TODO: Imports are ignored here.
    else
    {
      document.addEventListener("DOMContentLoaded", cb)
    }

  }
}

class DOM_View
{
  constructor() {}    // Home of this.html = this.generate(state)
  generate() {}       // Should generate all the HTML, returns HTML
  update() {}         // Makes changes to this.html, doesn't return anything
}

function FIND$(classInstances, classDeclaration)
{
  for (const classInstance of classInstances)
  {
    if (classInstance instanceof classDeclaration)
    {
      return classInstance
    }
  }
  return null
}

function INIT_CLASS$(rootElementQuery, appClass)
{
  // Initializes class-based apps.
  const rootElement = document.querySelector(rootElementQuery)

  // Don't proceed unless rootElement is actually an HTML element.
  if (!rootElement)
    throw Error("Could not find element with query:", rootElementQuery)

  let currentState = {}
  let previousState = {}

  // Create an instance of the app class.
  let app = new appClass(currentState)

  // Call the init method if it is defined.
  if (app.init) {
    app.init(currentState)
  }

  // Implicitly add a method called stateChanged.
  // This method will force the app to update by triggering the SJPSDOM_EVENT.
  // Can be used with callbacks.
  app.stateChanged = () => rootElement.dispatchEvent(SJPSDOM_EVENT)

  // Set the app html into the document view.
  SETE$(rootElement, app.html)

  function rootEventListener(_event)
  {
    // This function checks if the app state has changed.
    // If it has changed, the app will be updated.
    // This function is called when an event is triggered within the app.
    if (!deepEqual(currentState, previousState)) {
      app.update(currentState)
      previousState = deepCopyWithJSON(currentState)
    }
  }

  // Listen to the manual state changed event
  rootElement.addEventListener("sjpsdom-event", rootEventListener)

  // Loop through every HTML element in the app.
  // Start tracking each of the events that each element might be listening to.
  QA$('*', app.html).forEach(element => {
    getActiveEvents(element).forEach(event => {
      if (!rootElement[event])
        rootElement[event] = rootEventListener
    })
  })

}
