import React, {useEffect, useState, Component} from 'react'
import {sortBy} from 'lodash'
import './App.css';


const SORTS = {
  NONE: list => list,
  ID: list => sortBy(list, 'id'),
  FIRSTNAME: list => sortBy(list, 'firstname'),
  LASTNAME: list => sortBy(list, 'lastname'),
  EMAIL: list => sortBy(list, 'email'),
  PHONE: list => sortBy(list, 'phone'),
  }

//const list =[]

 const isSearched = searchTerm => item =>
  item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.phone.toLowerCase().includes(searchTerm.toLowerCase())



class App extends Component {



  // const [list, setList] = React.useState([])
  // const [loading, setLoading] = React.useState(true)

  // useEffect(() => {
  //   fetch('http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}')
  //   .then(response => response.json())
  //   .then(list => {
  //     setList(list)
  //     setLoading(false)
  //   })
  // }, [])

  constructor(props) {
    super(props)

    // fetch('http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}')
    // .then(response => response.json())
    // .then(list => {
    //   this.setState(list)
    // })

    this.state = {
      list: [],
      // item: {
      //   id: '',
      //   firstName: '',
      //   lastName: '',
      //   email: '',
      //   phone: '',
      //   description: '',
      //   address: {
      //     streetAddress: '',
      //     city: '',
      //     state: '',
      //     zip: '',
      //   }
      // },
      
      searchStr: '',
      searchPattern: '',

      sortKey: 'NONE',
      isSortReverse: false,

      currentPage: 1,
      itemsPerPage: 23,
      indexOfLastItem: 0, 
      indexOfFirstItem: 0,
      currentItems: 0,
      currentList: [],

      id: '',
      name: '',
      lastName: '',
      email: '',
      phone: '',
      idVal: false,
      nameVal: false,
      lastNameVal: false,
      emailVal: false,
      phoneVal: false,
      
      

    }

    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchClick = this.onSearchClick.bind(this)
    this.setList = this.setList.bind(this)
    this.onTrClick = this.onTrClick.bind(this)

    this.onSort = this.onSort.bind(this)
    this.paginate = this.paginate.bind(this)
    this.pagination = this.pagination.bind(this)
    this.idHandler = this.idHandler.bind(this)
    this.nameHandler = this.nameHandler.bind(this)
    this.lastNameHandler = this.lastNameHandler.bind(this)
    this.emailHandler = this.emailHandler.bind(this)
    this.phoneHandler = this.phoneHandler.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
  }

  emailHandler = (e) => {
    this.setState({ email: e.target.value })
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(e.target.value).toLowerCase())) {
      this.setState({ emailVal: true })
    } else {
      this.setState({ emailVal: false })
    }
    //console.log(this.state.emailVal)
  }

  idHandler = (e) => {
    this.setState({ id: e.target.value })
    const re = /^\d+$/
    if (re.test(String(e.target.value).toLowerCase())) {
      this.setState({ idVal: true })
    } else {
      this.setState({ idVal: false })
    }
  }

  phoneHandler = (e) => {
    this.setState({ phone: e.target.value })
    const re = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
    if (re.test(String(e.target.value).toLowerCase())) {
      this.setState({ phoneVal: true })
    } else {
      this.setState({ phoneVal: false })
    }
  }

  nameHandler = (e) => {
    this.setState({ name: e.target.value })
    const re = /[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]/gu
    if (re.test(String(e.target.value).toLowerCase())) {
      this.setState({ nameVal: true })
    } else {
      this.setState({ nameVal: false })
    }
  }

  lastNameHandler = (e) => {
    this.setState({ lastName: e.target.value })
    const re = /[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]/gu
    if (re.test(String(e.target.value).toLowerCase())) {
      this.setState({ lastNameVal: true })
    } else {
      this.setState({ lastNameVal: false })
    }
  }

  onAddClick(event) {
    event.preventDefault()

    if (this.state.idVal && this.state.nameVal && this.state.lastNameVal &&
      this.state.emailVal && this.state.phoneVal) {
        let item = {
          id: Number(this.state.id),
          firstName: this.state.name,
          lastName: this.state.lastName,
          email: this.state.email,
          phone: this.state.phone,
        }
        let newList = this.state.list
        newList.unshift(item)
        this.setState({ list: newList })
        //console.log(this.state.idVal, this.state.nameVal, this.state.lastNameVal,
        //  this.state.emailVal, this.state.phoneVal)
        //console.log(this.state.list)
    }
    this.pagination()
  }


  // Change page
  paginate = pageNumber => this.setState({currentPage: pageNumber});


  onSearchChange(event) {
    this.setState({ searchStr: event.target.value })
    // console.log(this.state.searchStr)
  }

  onSearchClick(event) {
    event.preventDefault()
    this.setState({ searchPattern: this.state.searchStr })
    // console.log(this.state.searchPattern)
  }

  setList(result) {
    this.setState({list: result})
  }

  onTrClick() {
    // this.setState({item: tr})
    console.log(this.state.item)
  }

  //Сортировка
  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse
    this.setState({ sortKey, isSortReverse })
  }


  pagination() {
    const {
      currentPage,
      itemsPerPage,
      list,
    } = this.state
    // console.log(this.state.list)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentList = list.slice(indexOfFirstItem, indexOfLastItem);
    //this.setState({currentList: currentList})
    this.setState({currentList: currentList})
    //console.log(this.state.currentList)
  }
    

  componentDidMount() {
  //  fetch('http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}')
    fetch('http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}')
    .then(response => response.json())
    .then(result => {
      this.setList(result)
      //console.log(this.state.list)
      this.pagination()

    })
    .catch(error => error)

    
  }

  render() {
    const {
            searchStr, 
            searchPattern,
            list, 
            item,
            sortKey,
            isSortReverse,
            currentList,
            itemsPerPage,
            id,
            name,
            lastName,
            email,
            phone
          } = this.state
          
          
    return (
      <div className="App">
        <Add 
          id={id}
          name={name}
          lastName={lastName}
          email={email}
          phone={phone}
          idHandler={this.idHandler}
          nameHandler={this.nameHandler}
          lastNameHandler={this.lastNameHandler}
          emailHandler={this.emailHandler}
          phoneHandler={this.phoneHandler}
          onAddClick={this.onAddClick}
        />
        <Search 
        searchStr = {searchStr}
        onChange={this.onSearchChange}
        onClick={this.onSearchClick}
        />
        {
          currentList  &&
          <Table 
          list = {currentList}
          pattern = {searchPattern}
          onClick = {this.onTrClick}
          sortKey={sortKey}
          isSortReverse={isSortReverse}
          onSort={this.onSort}
          />
        }

        <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={list.length}
        paginate={this.paginate}
        pagination={this.pagination}
        />
        
         {/* <Show 
        item = {item}
        /> */}
      </div>
    )
  }  
}

const Pagination = ({itemsPerPage, totalItems, paginate, pagination}) => {

  const pageNumbers = []
  
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <div className='pagination'>
        {pageNumbers.map(number => (
          <div key={number} className='page-item'>
            <a onClick={() => {paginate(number); pagination()}} href='!#' className='page-link'>
              {number}
            </a>
          </div>
        ))}
      </div>
    </nav>
  );
}

const Add = ({id, name, lastName, email, phone, 
              idHandler, nameHandler, lastNameHandler, emailHandler, phoneHandler,
              onAddClick}) => 
  <div>
    <form>
      <input value={id} onChange={idHandler} name="id" type="text" placeholder='id'/>
      <input value={name} onChange={nameHandler} name="name" type="text" placeholder='firstName'/>
      <input value={lastName} onChange={lastNameHandler} name="lastName" type="text" placeholder='lastName'/>
      <input value={email} onChange={emailHandler} name="email" type="text" placeholder='email'/>
      <input value={phone} onChange={phoneHandler} name="phone" type="text" placeholder='phone'/>
      <button onClick={onAddClick}>Добавить</button>
    </form>
  </div>

const Search = ({searchStr, onChange, onClick}) =>
  <form>
    <input 
    type="text" 
    value={searchStr}
    onChange={onChange}
    />
    <button
    onClick={onClick}
    >Найти</button>
  </form>

const UserButton = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const Table = ({list, pattern, onClick, sortKey, isSortReverse, onSort}) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
  ? sortedList.reverse()
  : sortedList;

  return(
    <div>
  <table className="main__table">
    <thead className="main__table__head">
      <tr>
        <th>
          <Sort
          sortKey={'ID'}
          onSort={onSort}
          >
          id
          </Sort>
        </th>
        <th>
          <Sort
          sortKey={'FIRSTNAME'}
          onSort={onSort}
          >
          firstName
          </Sort>
        </th>
        <th>
          <Sort
          sortKey={'LASTNAME'}
          onSort={onSort}
          >
          lastName
          </Sort>
        </th>
        <th>
          <Sort
          sortKey={'EMAIL'}
          onSort={onSort}
          >
          email
          </Sort>
        </th>
        <th>
          <Sort
          sortKey={'PHONE'}
          onSort={onSort}
          >
          phone
          </Sort>
        </th>
      </tr>
    </thead>
    <tbody>
      {reverseSortedList.filter(isSearched(pattern)).map(item => 
        <tr key={item.id} onClick={() => onClick(item)}>
          <td>{item.id}</td>
          <td>{item.firstName}</td>
          <td>{item.lastName}</td>
          <td>{item.email}</td>
          <td>{item.phone}</td>
        </tr>)}
    </tbody>
  </table>
  </div>
  )
}


const Sort = ({ sortKey, onSort, children }) =>
<UserButton onClick={() => onSort(sortKey)} className="button-inline">
{children}
</UserButton>

// const Show = (item) =>
//   <div>
//    <p>
//      {console.log(item)}
//     Выбран пользователь <b>{item.firstName} {item.lastName}</b><br/>
//     Описание: <br/>
//     <textarea defaultValue={item.description}>
      
//     </textarea> <br/>
//     Адрес проживания: <b>{item.address.streetAddress}</b> <br/>
//     Город: <b>{item.address.city}</b> <br/>
//     Провинция/штат: <b>{item.address.state}</b> <br/>
//     Индекс: <b>{item.address.zip}</b>  <br/>
//    </p>
//   </div>


  


export default App;
