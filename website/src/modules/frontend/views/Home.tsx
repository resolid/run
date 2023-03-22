import { server$ } from '@resolid/run';

const sayHello = server$(() => console.log('Hello world'));

function Home() {
  return (
    <div>
      <p>Home</p>
      <button onClick={() => sayHello()}>Say Hello!</button>
    </div>
  );
}

export default Home;
