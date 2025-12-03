//Not using right now
// models/UserProfile.js

export default class UserProfile {
    static nextId = 1;
  
    constructor({
      dietary_restrictions = [],
      cuisine_preferences = [],
      budget_usd = 0,
      time_available = 0,
      appliances = [],
    } = {}) {
      // Auto-generate unique user id (zero-padded)
      this.user_id = String(UserProfile.nextId).padStart(5, "0");
      UserProfile.nextId += 1;
  
      // Core fields
      this.dietary_restrictions = new Set(dietary_restrictions.map(String));
      this.cuisine_preferences = [...cuisine_preferences].map(String);
      this.budget_usd = Number(budget_usd);
      this.time_available = parseInt(time_available, 10) || 0;
      this.appliances = new Set(appliances.map(String));
  
      // recipe name -> numeric rating
      this.recipe_ratings = new Map();
    }
  
    // ---- mutations ----
    addRestriction(restriction) {
      this.dietary_restrictions.add(String(restriction));
      return this;
    }
    removeRestriction(restriction) {
      this.dietary_restrictions.delete(String(restriction));
      return this;
    }
  
    addPreference(pref) {
      this.cuisine_preferences.push(String(pref));
      return this;
    }
    removePreference(pref) {
      this.cuisine_preferences = this.cuisine_preferences.filter(p => p !== String(pref));
      return this;
    }
  
    setBudget(amount) {
      this.budget_usd = Number(amount);
      return this;
    }
    increaseBudget(delta) {
      this.budget_usd += Number(delta);
      return this;
    }
    decreaseBudget(delta) {
      this.budget_usd -= Number(delta);
      return this;
    }
  
    setTime(minutes) {
      this.time_available = parseInt(minutes, 10) || 0;
      return this;
    }
  
    addAppliance(appliance) {
      this.appliances.add(String(appliance));
      return this;
    }
    removeAppliance(appliance) {
      this.appliances.delete(String(appliance));
      return this;
    }
  
    rateRecipe(recipe, rating) {
      this.recipe_ratings.set(String(recipe), Number(rating));
      return this;
    }
  
    // ---- serialization helpers (so Sets/Maps become JSON-friendly) ----
    toJSON() {
      return {
        user_id: this.user_id,
        dietary_restrictions: [...this.dietary_restrictions],
        cuisine_preferences: [...this.cuisine_preferences],
        budget_usd: this.budget_usd,
        time_available: this.time_available,
        appliances: [...this.appliances],
        recipe_ratings: Object.fromEntries(this.recipe_ratings),
      };
    }
  
    static fromJSON(obj = {}) {
      const u = new UserProfile({
        dietary_restrictions: obj.dietary_restrictions ?? [],
        cuisine_preferences: obj.cuisine_preferences ?? [],
        budget_usd: obj.budget_usd ?? 0,
        time_available: obj.time_available ?? 0,
        appliances: obj.appliances ?? [],
      });
      if (obj.recipe_ratings) {
        for (const [k, v] of Object.entries(obj.recipe_ratings)) {
          u.recipe_ratings.set(k, Number(v));
        }
      }
      // If restoring old IDs, keep nextId consistent (optional)
      if (obj.user_id) {
        u.user_id = String(obj.user_id);
      }
      return u;
    }
  }
  