
const CounterView = (state, previousState, view) => {
  return (
    E$('div', {id: 'counter-view', class: 'row', style: 'padding-top: 30px;'},
      E$('p',
        E$('b', 'Word count: '),
        E$('span', state.count.toString())
      )
    )
  )
}

const TextAreaView = (state, previousState, view) => {

  const countWords = text => {
    const reducer = (count, string) => count + !!string.length
    const lines = text.split('\n').flatMap(line => line.split(' '))
    return lines.reduce(reducer, 0)
  }

  const oninput = event => {
    state.count = countWords(event.target.value)
  }

  return view || (
    E$('div', {id: 'textarea-view', class: 'row', style: 'padding-top: 30px;'},
      E$('textarea', {
        class: 'form-control',
        placeholder: 'Type here...',
        spellcheck: 'false',
        oninput: oninput,
      })
    )
  )

}

const HeadingView = (state, _previousState, view) => {
  return view || (
    E$('div', {id: 'heading-view', class: 'row', style: 'padding-top: 30px;'},
      E$('h1', state.title),
      E$('hr'),
      E$('p', state.heading)
    )
  )
}

const WordCountAppView = (state, previousState, view) => {

  state.title = state.title || 'Word Count App'
  state.heading = state.heading || 'This app counts up the words in the textbox below.'
  state.count = state.count || 0

  return (
    E$('div', {id: 'app-view', class: 'container'},
      HeadingView(state, previousState, ID$('heading-view')),
      TextAreaView(state, previousState, ID$('textarea-view')),
      CounterView(state, previousState, ID$('counter-view')),
    )
  )
}

const wordcount_import = true
