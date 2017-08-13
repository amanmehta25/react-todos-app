import React, { Component } from 'react';
import classnames from 'classnames';

import './app.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      data: [],
      filter: 'all',
      selectAll: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  clearCompleted() {
    let oldData = this.state.data;
    oldData = oldData.filter((data) => {
      return data.status === 'active';
    });
    
    this.setState({
      data: oldData,
      selectAll: false
    });
  }

  handleChange(e) {
    let clickedValue = e.target.value;
    let oldData = this.state.data;
    oldData = oldData.map((data) => {
      if (clickedValue === 'selectAll' || data.id === +clickedValue) {
        data.status = e.target.checked ? 'completed' : 'active';
      }

      return data;
    });

    if (clickedValue === 'selectAll') {
      this.setState({
        data: oldData,
        selectAll: e.target.checked ? true : false,
        count: e.target.checked ? 0 : oldData.length
      });
    } else {
      let flag = 0, count= 0;

      oldData.forEach((data) => {
        if (data.status === 'active') {
          flag = 1;
          count++;
        }
      });

      this.setState({
        data: oldData,
        selectAll: flag ? false : true,
        count
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const title = this.refs.title.value;
    if (title === '') {
      return;
    }

    let oldData = this.state.data;
    const id = oldData.length + 1;
    oldData.push({
      title,
      status: 'active',
      id
    });

    this.setState({
      data: oldData,
      count: this.state.count + 1,
      selectAll: false
    });
    this.refs.taskForm.reset();
  }

  setFilter(name) {
    this.setState({
      filter: name
    });
  }

  render() {
    const allFilterClass = classnames({
      'filter__status': true,
      'filter__status--active': this.state.filter === 'all'
    });

    const activeFilterClass = classnames({
      'filter__status': true,
      'filter__status--active': this.state.filter === 'active'
    });

    const completedFilterClass = classnames({
      'filter__status': true,
      'filter__status--active': this.state.filter === 'completed'
    });

    const helpText = this.state.count > 1 ? 'items' : 'item';

    return (
      <div className="app">
        <div className="app-header">
          <h1>todos</h1>
        </div>
        <div className="app-container">
          <form ref="taskForm" className="task-form" onSubmit={this.handleSubmit}>
            <input onChange={this.handleChange} type="checkbox" value="selectAll" checked={this.state.selectAll} />
            <input className="task-form__input" type="text" ref="title" placeholder="What needs to be done?"/>
          </form>
          {
            this.state.data
              .filter((data) => {
                if(this.state.filter === 'all') {
                  return data;
                } else {
                  return data.status === this.state.filter;
                }
              })
              .map((data, i) =>
                (
                  <div
                    key={i}
                    className="task-list"
                  >
                    <form className="display--inline-block">
                      <input onChange={this.handleChange} type="checkbox" name={data.title}
                      value={data.id} ref={data.id} checked={data.status === 'completed'} />
                    </form>
                    <div
                      className={classnames({
                        'task-list__name': true,
                        'task-list__name--completed': data.status === 'completed'
                      })}
                    >{data.title}</div>
                  </div>
                )
              )
          }
          <div className="filter-container">
            <div className="filter__item-count">{this.state.count} {helpText} left</div>
            <div className={allFilterClass} onClick={() => this.setFilter('all')}>All</div>
            <div className={activeFilterClass} onClick={() => this.setFilter('active')}>Active</div>
            <div className={completedFilterClass} onClick={() => this.setFilter('completed')}>Completed</div>
            <div className="filter__clear-completed" onClick={() => this.clearCompleted()}>Clear Completed</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
