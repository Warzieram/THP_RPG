class Character{
  constructor(hp, dmg, mana, name){
    this.name = name
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
    this.status = "playing"
    this.is_ai = false
  }

  takeDamage(ammount){
    this.hp -= ammount
    if (this.hp <= 0){
      this.status = "loser"
    } 
  }

  dealDamage(victim, ammount = this.dmg){
    victim.takeDamage(ammount)
    if(victim.status === "loser"){
      this.mana += 20
    }
  }

  specialAttack(){}
}

class Fighter extends Character{
  constructor(name){
    super(12, 4, 40, name)
    this.darkvision = false
    this.special_attack_name = "Dark Vision"
  }

  takeDamage(ammount){
    if(this.darkvision){
      super.takeDamage(ammount - 2)
      this.darkvision = false
    }
    else{
      super.takeDamage(ammount)
    }
  }

  specialAttack(victim){
    if(this.mana >= 20){
      this.dealDamage(victim, 5)
      this.mana -= 20
      this.darkvision = true
      console.log("DARK VISION !")
    }
    else{
      console.log("Pas assez de mana !")
    } 
  }

}

class Paladin extends Character{
  constructor(name){
    super(16, 3, 160, name)
    this.special_attack_name = "Healing Lightning"
  }

  specialAttack(victim){
    if(this.mana >= 40){
      this.dealDamage(victim, 4)
      this.hp += 5
      this.mana -= 40
      console.log("HEALING LIGHTNING !")
    }
    else{
      console.log("Pas assez de mana !")
    }
  }
}

class Monk extends Character{
  constructor(name){
    super(8, 2, 200, name)
    this.special_attack_name = "Heal"
  }

  specialAttack(){
    if(this.mana >= 25){
      this.hp += 8
      this.mana -= 25
      console.log("HEAL !")
    }
    else{
      console.log("Pas assez de mana !")
    }

  }
}

class Berserker extends Character{
  constructor(name){
    super(8, 4, 0, name)
    this.special_attack_name = "Rage"
  }

  specialAttack(){
    this.dmg += 1
    this.takeDamage(1)
    console.log("RAGE !")
  }
}

class Assassin extends Character{
  constructor(name){
    super(6, 6, 20, name)
    this.special_attack_name = "Shadow Hit"
    this.shadowhit = false
  }

  takeDamage(ammount){
    if(!this.shadowhit){
      super.takeDamage(ammount)
    }
    this.shadowhit = false
  }

  specialAttack(victim){
    if(this.mana >= 20){
      this.dealDamage(victim, 7)
      if(victim.status !== "loser"){
        this.hp -= 7
      }
      this.shadowhit = true
      this.mana -= 20
      console.log("SHADOW HIT !")
    }
    else{
      console.log("Pas assez de mana !")
    }
  }
}

class Wizard extends Character {
  constructor(name){
    super(10, 2, 200, name)
    this.special_attack_name = "Fireball"
  }

  specialAttack(victim){
    if (this.mana >= 25){
      this.dealDamage(victim, 7)
      console.log("FIREBALL !")
    }
    else{
      console.log("Pas assez de mana !")
    }

  }
}

class Thanos extends Character{
  constructor(name){
    super(8, 2, 1)
    this.special_attack_name = "Snap"
  }

  specialAttack(victim){
    // L'attaque spéciale de Thanos 
    // permet d'avoir une chance sur deux de tuer l'ennemi instantanément

    if(this.mana >= 1){

      let ran = Math.random()
      if(ran < 0.5){
        console.log(`Le snap a fonctionné ! ${victim.name} s'est évaporé !`)
        victim.hp = 0;
      }
      else{
        console.log("Le snap n'a pas fonctionné !")
      }
      this.mana = 0
    }
    else{
      console.log("Pas assez de mana !")
    }

  }
}

class Game {
  constructor(){
    this.turnLeft = 10
    this.going = true
    this.players = []
  }

  watchStats(){
    this.players.forEach(player => {
      if(player.hp > 0){
        console.log(`${player.name} : ${player.hp}HP, ${player.mana} points de mana, ${player.dmg} degats`)
      }
      else{
        console.log(`${player.name} : Mort`)
      }
    });
  }

  endGame(){
    console.log("La partie est terminée !")
    console.log("Le(s) Gagnant(es) sont : ")
    console.log(this.players.filter((player) => {
      return player.status === "winner"
    }))
  }

  skipTurn(){
    this.turnLeft -= 1

    let alive_players = this.players.filter((p) => {
      return p.hp > 0
    })

    if (this.turnLeft === 0 || alive_players.length == 1){
      this.going = false
      this.players.forEach(player => {
        if(player.status !== "loser"){
          player.status = "winner"
        } 
      });
      this.endGame()
    }
    else{
      this.startTurn()
    }
  }

  startTurn() {
    console.log(`It's turn ${10 - this.turnLeft + 1}`)
    this.players.forEach(player => {
      if(player.hp > 0){
        this.watchStats()
        console.log(`It's time for ${player.name} to play !`);

        console.log("Que veux tu faire ?")
        console.log("1) Attaquer !")
        console.log(`2) ${player.special_attack_name}`)
        let input = ""
        if(player.is_ai){
          let options = ["1", "2"]
          input = options[Math.floor(Math.random() * 2)]
        }
        else{
          input = prompt()
        }

        switch (input) {
          case "1":
            console.log("Qui veux tu atttaquer ?")
            let targets = this.players.filter((p) => {
              return p != player && p.status !== "loser"
            })
            targets.forEach((target, index) => {
              console.log(`${index +1}) ${target.name}`)
            });
            let choice = ""
            if(player.is_ai){
              let killable_players = targets.filter((p) => {
                return p.hp <= player.dmg 
              });
              if(killable_players.length != 0){
                choice = Math.floor(Math.random() * killable_players.length)
              }
              else{ 
                choice = Math.floor(Math.random() * targets.length)
              }
            }
            else{
              choice = parseInt(prompt()) - 1;
            }

            if(choice < 0 || choice > this.players.length){
              console.log("Entrée incorrecte, votre tour a été passé !")
            }
            else{
              let target = targets[choice]
              player.dealDamage(target)
              console.log(`${player.name} inflige ${player.dmg} dégats a ${target.name} !`)
              console.log(`Il lui reste ${target.hp} points de vie !`)
            }
            break;

          case "2":
            if(player instanceof Assassin || player instanceof Paladin || player instanceof Fighter || player instanceof Wizard || player instanceof Thanos){

              let targets = this.players.filter((p) => {
                return p != player && p.status !== "loser"
              })
              targets.forEach((target, index) => {
                console.log(`${index +1}) ${target.name}`)
              });
              let choice = ""
              if(player.is_ai){
                choice = Math.floor(Math.random() * targets.length)
              }
              else{
                choice = parseInt(prompt()) - 1
              }
              console.log(choice)
              player.specialAttack(targets[choice])
            }
            else{
              player.specialAttack()
            }

        }


      }
    });

    this.skipTurn()
  }

  addPlayer(player){
    this.players.push(player)
  }

  startGame(){
    console.log("Bienvenue dans ce super jeu !")
    let classes = [Fighter, Wizard, Thanos, Paladin, Monk, Berserker, Assassin]
    for(let i = 0; i < 5; i++){
      let ind = Math.floor(Math.random() * classes.length);
      let new_instance = new classes[ind]
      new_instance.name = `Joueur ${i+1}`
      this.players.push(new_instance)
    }
    this.players[0].is_ai = true
    console.log(this)
    this.startTurn();
  }
}

let Grace = new Fighter("Grace")
let Ulder = new Paladin("Ulder")
let Moana = new Monk("Moana")
let Draven = new Berserker("Draven")
let Carl = new Assassin("Carl")

let game = new Game()
game.startGame()
