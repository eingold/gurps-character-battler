import './App.css';
import { useState } from 'react';
import FileUploadForm from './Components/FileUploadForm';
import CharacterPanel from './Components/CharacterPanel';
import ManoeuvreForm from './Components/ManoeuvreForm';
import TextLog from './Components/TextLog';

function App() {

  const [characterOne, setCharacterOne] = useState({});
  const [characterTwo, setCharacterTwo] = useState({});

  const [turnOrder, setTurnOrder] = useState(true); //true means character 1's turn, false means character 2's turn. 
  const [defenceNeeded, setDefenceNeeded] = useState(false); //this means whether a defence is needed from the party that is NOT currently taking their turn
  const [attackingWeapon, setAttackingWeapon] = useState({}); //this is for storing the weapon used to attack when a defence is needed (since the attacker's weapon is not present on the defender's sheet this must live here to be sent by the defender)

  const [logText, setLogText] = useState("");

  const changeTurn = () => {
    setTurnOrder(!turnOrder);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className='col-md-6'>
            <FileUploadForm setCharacter={setCharacterOne} />
            <CharacterPanel character={characterOne} />
            <ManoeuvreForm actor={characterOne} target={characterTwo} updateActor={setCharacterOne} updateTarget={setCharacterTwo} myTurn={turnOrder} changeTurn={changeTurn} defenceNeeded={defenceNeeded} setDefenceNeeded={setDefenceNeeded} logText={logText} setLogText={setLogText} attackingWeapon={attackingWeapon} setAttackingWeapon={setAttackingWeapon} />
          </div>
          <div className='col-md-6'>
            <FileUploadForm setCharacter={setCharacterTwo} />
            <CharacterPanel character={characterTwo} />
            <ManoeuvreForm actor={characterTwo} target={characterOne} updateActor={setCharacterTwo} updateTarget={setCharacterOne} myTurn={!turnOrder} changeTurn={changeTurn} defenceNeeded={defenceNeeded} setDefenceNeeded={setDefenceNeeded} logText={logText} setLogText={setLogText} attackingWeapon={attackingWeapon} setAttackingWeapon={setAttackingWeapon} />
          </div>
        </div>
        <div className="row">
          <TextLog logText={logText} setLogText={setLogText} />
        </div>
      </div>
    </div>
  );
}

export default App;
