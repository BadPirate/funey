import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <h1>Welcome to Funey!</h1>
      <p>Make learning about money fun!</p>
      <p>A website for creating a fake checking account that you can deposit and remove from, 
        as well as provide automatic interest towards, and your children can see the balance of.
        For the purpose of teaching the value of saving / good spending habits.
      </p>
      <h2>Create Account:</h2>
      <form method="POST" action="/api/create">
        <input name="user" placeholder="user"></input><br/>
        <input type="password" name="pass" placeholder="Password"></input><br/>
        <input type="password" name="pass2" placeholder="Retype Password"></input><br/>
        <input type="submit" name="submit" value="Create Account"></input>
      </form>
      <h2>Login</h2>
      <form method="POST" action="/api/login">
        <input name="user" placeholder="user"></input><br/>
        <input type="password" name="pass" placeholder="Password"/><br/>
        <input type="submit" value="Login"/>
      </form>
    </div>
  )
}
