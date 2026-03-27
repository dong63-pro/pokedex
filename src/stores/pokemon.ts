import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface Pokemon {
  id: number
  name: string
  nameZh: string
  types: string[]
  image: string
  height: number
  weight: number
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dark: '#705848',
  fairy: '#EE99AC'
}

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonList = ref<Pokemon[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = 20
  const total = ref(151)

  const zhNames: Record<string, string> = {
    bulbasaur: '妙蛙种子',
    ivysaur: '妙蛙草',
    venusaur: '妙蛙花',
    charmander: '小火龙',
    charmeleon: '火恐龙',
    charizard: '喷火龙',
    squirtle: '杰尼龟',
    wartortle: '卡咪龟',
    blastoise: '水箭龟',
    caterpie: '绿毛虫',
    metapod: '铁甲蛹',
    butterfree: '巴大蝶',
    weedle: '独角虫',
    kakuna: '铁壳蛹',
    beedrill: '大针蜂',
    pidgey: '波波',
    pidgeotto: '比比鸟',
    pidgeot: '大比鸟',
    rattata: '小拉达',
    raticate: '拉达',
    spearow: '小雀鹰',
    fearow: '大雀鹰',
    ekans: '阿柏蛇',
    arbok: '帕拉斯',
    pikachu: '皮卡丘',
    raichu: '雷丘',
    sandshrew: '穿山鼠',
    sandslash: '穿山王',
    nidoran: '尼多兰',
    nidorina: '尼多娜',
    nidoqueen: '尼多后',
    nidorino: '尼多郎',
    nidoking: '尼多王',
    clefairy: '皮皮',
    clefable: '皮可西',
    vulpix: '六尾',
    ninetales: '九尾',
    jigglypuff: '胖丁',
    wigglytuff: '胖可丁',
    zubat: '超音蝠',
    golbat: '大蝠',
    oddish: '园艺草',
    gloom: '臭臭花',
    vileplume: '霸王花',
    paras: '派拉斯',
    parasect: '派克司',
    venonat: '毛球',
    venomoth: '末入蛾',
    diglett: '地鼠',
    dugtrio: '三地鼠',
    meowth: '喵喵',
    persian: '百变怪',
    psyduck: '可达鸭',
    golduck: '哥达鸭',
    mankey: '猴怪',
    growlithe: '卡蒂狗',
    arcanine: '风速狗',
    poliwag: '乌波',
    poliwhirl: '蛙泳',
    poliwrath: '进化龟',
    abra: '凯西',
    kadabra: '勇基拉',
    alakazam: '胡地',
    machop: '腕力',
    machoke: '豪力',
    machamp: '怪力',
    bellsprout: '喇叭芽',
    weepinbell: '口呆花',
    victreebel: '大食花',
    tentacool: '玛瑙水母',
    tentacruel: '毒刺水母',
    geodude: '小拳石',
    graveler: '隆隆石',
    golem: '大岩蛇',
    ponyta: '小火马',
    rapidash: '烈焰马',
    slowpoke: '大舌贝',
    slowbro: '刺甲贝',
    magnemite: '磁铁',
    magneton: '三合一磁怪',
    farfetchd: '大葱鸭',
    doduo: '嘟嘟',
    dodrio: '嘟嘟利',
    seel: '小海狮',
    dewgong: '白海狮',
    grimer: '臭泥',
    muk: '臭臭泥',
    shellder: '贝壳怪',
    cloyster: '刺甲贝',
    gastly: '鬼斯',
    haunter: '鬼斯通',
    gengar: '耿鬼',
    onix: '大岩蛇',
    hypno: '引梦貘人',
    drowzee: '催眠貘',
    krabby: '大钳蟹',
    kingler: '巨钳蟹',
    voltorb: '雷电子',
    electrode: '电击兽',
    exeggcute: '蛋蛋',
    exeggutor: '椰蛋树',
    cubone: '卡拉卡拉',
    marowak: '嘎啦嘎啦',
    hitmonlee: '飞腿郎',
    hitmonchan: '快拳郎',
    lickitung: '大舌头',
    koffing: '瓦斯弹',
    weezing: '双弹瓦斯',
    rhyhorn: '独角犀牛',
    rhydon: '钻角犀兽',
    chansey: '吉利蛋',
    tangela: '蔓藤兽',
    kangaskhan: '袋兽',
    horsea: '墨海马',
    seadra: '刺海马',
    goldeen: '角金鱼',
    seaking: '海星星',
    staryu: '海星星',
    starmie: '宝石海星',
    mr_mime: '魔墙人偶',
    scyther: '飞天螳螂',
    jynx: '迷唇姐',
    electabuzz: '电击兽',
    magmar: '鸭嘴火兽',
    pinsir: '大甲',
    tauros: '大岩蛇',
    magikarp: '鲤鱼王',
    gyarados: '暴鲤龙',
    lapras: '拉普拉斯',
    ditto: '百变怪',
    eevee: '伊布',
    vaporeon: '水伊布',
    jolteon: '雷伊布',
    flareon: '火伊布',
    porygon: '多边兽',
    omanyte: '菊石兽',
    omastar: '化石盔',
    kabuto: '化石盔',
    kabutops: '化石盔',
    aerodactyl: '化石翼龙',
    snorlax: '卡比兽',
    articuno: '急冻鸟',
    zapdos: '闪电鸟',
    moltres: '火焰鸟',
    dratini: '迷你龙',
    dragonair: '哈克萨斯',
    dragonite: '快龙',
    mewtwo: '超梦',
    mew: '梦幻'
  }

  const filteredList = computed(() => {
    if (!searchQuery.value) return pokemonList.value
    const query = searchQuery.value.toLowerCase()
    return pokemonList.value.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.nameZh.includes(query)
    )
  })

  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredList.value.slice(start, start + pageSize)
  })

  const totalPages = computed(() => Math.ceil(filteredList.value.length / pageSize))

  function getTypeColor(type: string): string {
    return typeColors[type.toLowerCase()] || '#A8A878'
  }

  async function fetchPokemon(id: number): Promise<Pokemon> {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    return {
      id: data.id,
      name: data.name,
      nameZh: zhNames[data.name] || data.name,
      types: data.types.map((t: any) => t.type.name),
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speed: data.stats[5].base_stat
      }
    }
  }

  async function fetchAllPokemon() {
    loading.value = true
    try {
      const promises = []
      for (let i = 1; i <= 151; i++) {
        promises.push(fetchPokemon(i))
      }
      pokemonList.value = await Promise.all(promises)
    } catch (error) {
      console.error('Failed to fetch pokemon:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    pokemonList,
    searchQuery,
    loading,
    currentPage,
    total,
    filteredList,
    paginatedList,
    totalPages,
    getTypeColor,
    fetchAllPokemon
  }
})