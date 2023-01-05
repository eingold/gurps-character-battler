import './App.css';
import { useState } from 'react';
import { FileUploadForm } from './Components/FileUploadForm';
import CharacterPanel from './Components/CharacterPanel';

function App() {

  const [characterOne, setCharacterOne] = useState({});
  const [characterTwo, setCharacterTwo] = useState({});

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className='col-md-6'>
            <FileUploadForm setCharacter={setCharacterOne} />
            <CharacterPanel character={characterOne} />
          </div>
          <div className='col-md-6'>
            <FileUploadForm setCharacter={setCharacterTwo} />
            <CharacterPanel character={characterTwo} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
