# gurps-character-battler
A full stack project developed after completion of the Digital Futures Software Engineering Academy, to solidify learned skills.

# Project goals
The goal of this project is to solidify my skills in react and express by building a web app that allows users to upload two character files from the GURPS Character Sheet program (https://gurpscharactersheet.com/), view the stats and skills of those characters, and simulate duels between the two characters by selecting combat manouevres and active defenses. The app will calculate the results of each turn and update the character stats and skills accordingly. Turn resolution will be handled by a back-end server running a RESTful API that implements the GURPS combat rules.

## MoSCoW analysis

### Must:
- Allow the user to upload two .gcs files from the GURPS Character Sheet program, and display each character's stats and skills
- Provide an interface for users to select the combat manouevre and appropriate parameters for a character's turn
- Prompt the target of an attack for an appropriate response (e.g. an active defense) 
- Implement at least the Attack manouevre, for all the character's available melee attacks, and the three active defences of Dodge, Block, and Parry, and calculate the result according to Chapter 11 (Combat) of the GURPS Basic Set
- Track the damage dealt by each attacking, taking into consideration wounding multipliers and damage resistance, and make appropriate changes to the target's health
### Should:
- Allow all the combat manouevres in the Basic Set (All-Out Attack, Evaluate, etc.) and implement them correctly, except for the Wait manouevre
- Allow the use of ranged attacks
- Automatically calculate the results of injury, such as major wounds, stun, shock, knockdown, unconsciousness, and death
- Implement at least some optional rules from the Basic Set, such as hit location or Extra Effort
### Could:
- Implement additional optional manouevres and rules from source books such as Martial Arts or Tactical Shooting
### Won't:
- Store any persistent data about the end user
- Implement the Wait manouevre (arbitrary conditional logic for resolving manouevres is definitely beyond the scope of this project)
- Implement anything that would require the adjudication of a GM (I am building a combat tracker, not an AGI that plays GURPS with you)
- Provide a battle map (I am not trying to build a VTT)
- Support Innate Attack modifiers (at least for now)

# User stories
```
Epic: As a user, so that I can streamline the GURPS combat experience, I want to be able to simulate duels between characters with this app.

As a user, so that I can simulate my characters specifically, I want to be able to upload character files from the GURPS Character Sheet program.

As a user, so that I can track the overall state of my character, I want to be able to see my character's health and fatigue points.

As a user, so that I can understand my character's capabilities, I want to see my character's equipped weapons and stats.

As a user, so that I can achieve victory in the duel, I want to be able to attack my opponent.

As a user, so that I can have more options in combat, I want to be able to choose which weapon and method I am attacking with.

As a user, so that I do not have to spend time rolling dice or memorising the rules, I want the app to automatically calculate whether my attack succeeds or not.

As a user, so that my character can survive better, I want to be able to choose a defence to use when my character is attacked.

As a user, so that I do not have to spend time rolling dice or memorising the rules, I want the app to automatically calculate whether my defence succeeds or not.

As a user, so that I can bring my opponent closer to defeat, I want the app to calculate damage for my successful attacks and subtract it from my opponent's health.

As a user, so that my character can be more survivable, I want the app to subtract my character's damage resistance from the damage of an incoming attack.

As a user, so that combat is more streamlined, I want the app to automatically calculate roll a death save when my character passes the relevant health threshold.

As a user, so that I can keep track of the battle, I want the app to display a log of the different manouevres taken and their outcomes.
```

Data models
===============
## Front end
| Data needed    | Components     | State owner   | Request type | Request body                                                            | Request URL |
| -------------- | -------------- | ------------- | ------------ | ----------------------------------------------------------------------- | ----------- |
| Send manouevre | Manouevre form | ManouevreForm | POST         | {manouevre, modifiers, actor, target, attackingWeapon, defendingWeapon} | /manoeuvre  |

## Back end
| Data request                                                                           | API route  | Request type | Request body                                                            | Response status | Response data                                      |
| -------------------------------------------------------------------------------------- | ---------- | ------------ | ----------------------------------------------------------------------- | --------------- | -------------------------------------------------- |
| Process a manouevre, calculate its outcome, and send back the updated character sheets | /manoeuvre | POST         | {manouevre, modifiers, actor, target, attackingWeapon, defendingWeapon} | 200             | {defenceNeeded, modifiers, actor, target, logText} |