<template>
  <div class="calculator">
    <section class="calculator_left">
      <header>
        <h1 class="calculator_title">Mortgage Calculator</h1>
        <button class="calculator_clear">Clear All</button>
      </header>
      <form @submit.prevent="submitForm">
        <label for="mortgage">Mortgage Amount</label>
        <div class="inp_icon" :class="{'inp_error': isError}">
          <span class="icon_money">£</span>
          <input id="mortgage" name="mortgage" type="number" v-model="mortgage">
        </div>
        <p class="error" v-show="isError">This held is required</p>
        <section class="term_rate">
          <section>
            <label for="trem">Mortgage Term</label>
            <div class="inp_icon" :class="{'inp_error': isError}">
              <input id="trem" name="trem" type="number">
              <span class="icon_years">years</span>
            </div>
            <p class="error" v-show="isError">This held is required</p>
          </section>
          <section>
            <label for="rate">Interest Rate</label>
            <div class="inp_icon" :class="{'inp_error': isError}">
              <input id="rate" name="rate" type="number">
              <span class="icon_f">%</span>
            </div>
            <p class="error" v-show="isError">This held is required</p>
          </section>
        </section>
        <fieldset>
          <legend>Mortgage Type</legend>
          <div class="inp_box" :class="{ active: mortgageType === 'Repayment' }">
            <input v-model="mortgageType" type="radio" name="type" id="repayment" value="Repayment">
            <label for="repayment">Repayment</label>
          </div>
          <div class="inp_box" :class="{ active: mortgageType === 'Interest Only' }">
            <input v-model="mortgageType" type="radio" name="type" id="interest" value="Interest Only">
            <label for="interest">Interest Only</label>
          </div>
          <p class="error" v-show="isError">This held is required</p>
        </fieldset>
        <button class="submit_btn" type="submit">Calculate Repayments</button>
      </form>
    </section>
    <section class="calculator_right">
      <div class="empty" v-if="isEmpty">
        <img src="./assets/images/illustration-empty.svg" alt="empty" class="empty_img">
        <h2 class="empty_title">Results shown here</h2>
        <p class="empty_context">Complete the form and click “calculate repayments” to see what
          your monthly repayments would be.
        </p>
      </div>
      <div class="calculator_result" v-else>
        <h2>Your results</h2>
        <p class="result_context">
          Your results are shown below based on the information you provided.
          To adjust the results, edit the form and click “calculate repayments” again.
        </p>
        <ul class="calculator_repay">
          <li>
            <h3>Your monthly repayments</h3>
            <p class="monthly">1</p>
          </li>
          <li>
            <h3>Total you'll repay over the term</h3>
            <p class="total">1</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      isEmpty: true, // 是否为空
      mortgageType: '', // 是否选中
      isError: false, // 是否错误
      form: {
        mortgage: ''
      }
    }
  },
  methods: {
    submitForm () {
      console.log(111)
    }
  }
}
</script>

<style lang="less">
@import './styles/index.less';
</style>
