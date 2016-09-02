var defense = {
    fire : {
        super: ["ground", "rock", "water"],
        ineffective: ["bug", "fairy", "fire", "grass", "ice", "steel"],
        immune: []
    },
    electric : {
        super: ["ground"],
        ineffective: ["electric", "flying", "steel"],
        immune: []
    },
    poison : {
        super: ["ground", "psychic"],
        ineffective: ["bug", "fairy", "fight", "grass", "poison"],
        immune: []
    },
    rock : {
        super: ["fighting", "grass", "ground", "steel", "water"],
        ineffective: ["fire", "flying", "normal", "poison"],
        immune: []
    },
    steel : {
        super: ["fighting", "fire", "ground"],
        ineffective: ["bug", "dragon", "fairy", "flying", "grass", "ice", "normal", "psychic", "rock", "steel"],
        immune: ["poison"]
    },
    normal : {
        super: ["fighting"],
        ineffective: [],
        immune: ["ghost"]
    },
    fighting : {
        super: ["fairy", "flying", "psychic"],
        ineffective: ["bug", "dark", "rock"],
        immune: []
    },
    ghost : {
        super: ["dark", "ghost"],
        ineffective: ["bug", "poison"],
        immune: ["fighting", "normal"]
    },
    psychic : {
        super: ["bug", "dark", "ghost"],
        ineffective: ["fight", "psychic"],
        immune: []
    },
    ice : {
        super: ["fighting", "fire", "rock", "steel"],
        ineffective: ["ice"],
        immune: []
    },
    dark : {
        super: ["bug", "fairy", "fight"],
        ineffective: ["dark", "ghost"],
        immune: ["psychic"]
    },
    fairy : {
        super: ["bug", "dark", "fight"],
        ineffective: ["poison", "steel"],
        immune: ["dragon"]
    },
    ground : {
        super: ["ice", "water", "grass"],
        ineffective: ["poison", "rock"],
        immune: ["electric"]
    },
    bug : {
        super: ["fire", "flying", "rock"],
        ineffective: ["fighting", "grass", "ground"],
        immune: []
    },
    water : {
        super: ["electric", "grass"],
        ineffective: ["fire", "ice", "steel", "water"],
        immune: []
    },
    grass : {
        super: ["bug", "fire", "flying", "ice", "poison"],
        ineffective: ["electric", "grass", "ground", "water"],
        immune: []
    },
    dragon : {
        super: ["dragon", "fairy", "ice"],
        ineffective: ["electric", "fire", "grass", "water"],
        immune: []
    },
    flying : {
        super: ["electric", "ice", "rock"],
        ineffective: ["bug", "fight", "grass"],
        immune: ["ground"]
    },
};

