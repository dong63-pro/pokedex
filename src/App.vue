<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePokemonStore, type Pokemon } from './stores/pokemon'
import { Search, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const store = usePokemonStore()
const selectedPokemon = ref<Pokemon | null>(null)
const dialogVisible = ref(false)

onMounted(() => {
  store.fetchAllPokemon()
})

function showDetail(pokemon: Pokemon) {
  selectedPokemon.value = pokemon
  dialogVisible.value = true
}

function prevPage() {
  if (store.currentPage > 1) {
    store.currentPage--
  }
}

function nextPage() {
  if (store.currentPage < store.totalPages) {
    store.currentPage++
  }
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1 class="title">🏠 宝可梦图鉴</h1>
        <div class="search-box">
          <el-input
            v-model="store.searchQuery"
            placeholder="搜索宝可梦名称..."
            :prefix-icon="Search"
            clearable
            size="large"
          />
        </div>
      </div>
    </header>

    <main class="main">
      <div v-if="store.loading" class="loading">
        <el-icon class="is-loading" :size="50"><Loading /></el-icon>
        <p>正在加载宝可梦...</p>
      </div>

      <template v-else>
        <div class="pokemon-grid">
          <div
            v-for="pokemon in store.paginatedList"
            :key="pokemon.id"
            class="pokemon-card"
            @click="showDetail(pokemon)"
          >
            <div class="card-image">
              <img :src="pokemon.image" :alt="pokemon.name" loading="lazy" />
            </div>
            <div class="card-info">
              <span class="pokemon-id">#{{ String(pokemon.id).padStart(3, '0') }}</span>
              <h3 class="pokemon-name">{{ pokemon.nameZh }}</h3>
              <div class="pokemon-types">
                <span
                  v-for="type in pokemon.types"
                  :key="type"
                  class="type-tag"
                  :style="{ backgroundColor: store.getTypeColor(type) }"
                >
                  {{ type }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.filteredList.length === 0" class="empty">
          <p>没有找到匹配的宝可梦</p>
        </div>

        <div v-if="store.totalPages > 1" class="pagination">
          <el-button
            :icon="ArrowLeft"
            :disabled="store.currentPage === 1"
            @click="prevPage"
          />
          <span class="page-info">{{ store.currentPage }} / {{ store.totalPages }}</span>
          <el-button
            :icon="ArrowRight"
            :disabled="store.currentPage >= store.totalPages"
            @click="nextPage"
          />
        </div>
      </template>
    </main>

    <footer class="footer">
      <p>数据来源: PokeAPI | © 2026 Pokédex</p>
    </footer>

    <el-dialog
      v-model="dialogVisible"
      :title="selectedPokemon?.nameZh"
      width="90%"
      class="detail-dialog"
    >
      <div v-if="selectedPokemon" class="detail-content">
        <div class="detail-image">
          <img :src="selectedPokemon.image" :alt="selectedPokemon.name" />
        </div>
        <div class="detail-info">
          <div class="detail-types">
            <span
              v-for="type in selectedPokemon.types"
              :key="type"
              class="type-tag large"
              :style="{ backgroundColor: store.getTypeColor(type) }"
            >
              {{ type }}
            </span>
          </div>
          <div class="detail-stats">
            <div class="stat-item">
              <span class="stat-label">HP</span>
              <el-progress
                :percentage="(selectedPokemon.stats.hp / 200) * 100"
                :color="store.getTypeColor(selectedPokemon.types[0])"
              />
              <span class="stat-value">{{ selectedPokemon.stats.hp }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">攻击</span>
              <el-progress
                :percentage="(selectedPokemon.stats.attack / 200) * 100"
                :color="store.getTypeColor(selectedPokemon.types[0])"
              />
              <span class="stat-value">{{ selectedPokemon.stats.attack }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">防御</span>
              <el-progress
                :percentage="(selectedPokemon.stats.defense / 200) * 100"
                :color="store.getTypeColor(selectedPokemon.types[0])"
              />
              <span class="stat-value">{{ selectedPokemon.stats.defense }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">速度</span>
              <el-progress
                :percentage="(selectedPokemon.stats.speed / 200) * 100"
                :color="store.getTypeColor(selectedPokemon.types[0])"
              />
              <span class="stat-value">{{ selectedPokemon.stats.speed }}</span>
            </div>
          </div>
          <div class="detail-extra">
            <p>身高: {{ selectedPokemon.height }} m</p>
            <p>体重: {{ selectedPokemon.weight }} kg</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+SC:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', sans-serif;
  background-color: #fafafa;
  color: #2c3e50;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #ff6b6b, #ffa502);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.title {
  font-family: 'ZCOOL KuaiLe', cursive;
  font-size: 1.8rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.search-box {
  flex: 1;
  max-width: 400px;
  min-width: 200px;
}

.search-box .el-input__wrapper {
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.pokemon-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.pokemon-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  transition: transform 0.3s;
}

.pokemon-card:hover .card-image img {
  transform: scale(1.1);
}

.card-info {
  padding: 1rem;
  text-align: center;
}

.pokemon-id {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.pokemon-name {
  font-family: 'ZCOOL KuaiLe', cursive;
  font-size: 1.3rem;
  margin: 0.5rem 0;
  color: #2c3e50;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.type-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  font-weight: 500;
  text-transform: capitalize;
}

.type-tag.large {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  font-size: 1rem;
  color: #2c3e50;
}

.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-image {
  text-align: center;
  background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
  padding: 1rem;
  border-radius: 12px;
}

.detail-image img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.detail-info {
  padding: 0.5rem;
}

.detail-types {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.detail-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  width: 50px;
  font-weight: 500;
}

.stat-item .el-progress {
  flex: 1;
}

.stat-value {
  width: 40px;
  text-align: right;
  font-weight: 500;
}

.detail-extra {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
}

.detail-extra p {
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .title {
    font-size: 1.5rem;
  }

  .search-box {
    width: 100%;
    max-width: none;
  }

  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .card-image img {
    width: 100px;
    height: 100px;
  }

  .pokemon-name {
    font-size: 1.1rem;
  }

  .type-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .card-image img {
    width: 80px;
    height: 80px;
  }

  .card-info {
    padding: 0.5rem;
  }

  .pokemon-name {
    font-size: 1rem;
  }
}
</style>