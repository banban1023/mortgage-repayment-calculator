<template>
  <div class="calculator">
    <section class="calculator_left">
      <header>
        <h1 class="calculator_title">Mortgage Calculator</h1>
        <button class="calculator_clear" @click="clearAll">Clear All</button>
      </header>
      <form @submit.prevent="submitForm">
        <label for="mortgage">Mortgage Amount</label>
        <div class="inp_icon" :class="{'inp_error': isError.mortgage}">
          <span class="icon_money">£</span>
          <input
            id="mortgage"
            name="mortgage"
            type="text"
            :value="formattedMortgage"
            @input="onMortgageInput($event.target.value)"
            inputmode="decimal"
            pattern="[\d,\.]*"
            @keydown="onKeyDown"
          >
        </div>
        <p class="error" v-show="isError.mortgage">This held is required</p>
        <section class="term_rate">
          <section>
            <label for="trem">Mortgage Term</label>
            <div class="inp_icon" :class="{'inp_error': isError.trem}">
              <input id="trem" name="trem" type="number" v-model="form.trem">
              <span class="icon_years">years</span>
            </div>
            <p class="error" v-show="isError.trem">This held is required</p>
          </section>
          <section>
            <label for="rate">Interest Rate</label>
            <div class="inp_icon" :class="{'inp_error': isError.rate}">
              <input step="0.01" id="rate" name="rate" type="number" v-model="form.rate">
              <span class="icon_f">%</span>
            </div>
            <p class="error" v-show="isError.rate">This held is required</p>
          </section>
        </section>
        <fieldset>
          <legend>Mortgage Type</legend>
          <div class="inp_box" :class="{ active: form.mortgageType === 'Repayment' }">
            <input v-model="form.mortgageType" type="radio" name="type" id="repayment" value="Repayment">
            <label for="repayment">Repayment</label>
          </div>
          <div class="inp_box" :class="{ active: form.mortgageType === 'Interest Only' }">
            <input v-model="form.mortgageType" type="radio" name="type" id="interest" value="Interest Only">
            <label for="interest">Interest Only</label>
          </div>
          <p class="error" v-show="isError.mortgageType">This held is required</p>
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
            <p class="monthly" ref="monthlyRef">£0.00</p>
          </li>
          <li>
            <h3>Total you'll repay over the term</h3>
            <p class="total" ref="totalRef">£0.00 </p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { gsap } from 'gsap'
export default {
  name: 'App',
  data () {
    return {
      isEmpty: true, // 是否为空
      // mortgageType: '', // 是否选中
      isError: {
        mortgage: false,
        trem: false,
        mortgageType: false,
        rate: false
      }, // 是否错误
      form: {
        mortgage: '',
        trem: '',
        mortgageType: '',
        rate: ''
      },
      result: {
        monthly: 0,
        total: 0
      }
    }
  },
  computed: {
    formattedMortgage () {
      if (!this.form.mortgage) return ''
      const [integer, decimal] = this.form.mortgage.split('.')
      const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt
    }
  },
  methods: {
    formatWithCommas (value) {
      const number = Number(value)
      if (isNaN(number)) return value
      return number.toLocaleString('en-UK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    onMortgageInput (value) {
    // 移除所有非数字和小数点
      const clean = value.replace(/[^0-9.]/g, '')

      // 只允许出现一个小数点
      const parts = clean.split('.')
      if (parts.length > 2) return // 多个小数点非法，忽略

      // 重新拼接合法数字
      const numeric = parts[0] + (parts[1] !== undefined ? '.' + parts[1] : '')

      // 更新原始数据
      this.form.mortgage = numeric
    },
    validateForm () {
      this.isError.mortgage = !this.form.mortgage
      this.isError.trem = !this.form.trem
      this.isError.rate = !this.form.rate
      this.isError.mortgageType = !this.form.mortgageType

      return !(this.isError.mortgage || this.isError.trem || this.isError.rate || this.isError.mortgageType)
    },
    submitForm () {
      if (!this.validateForm()) {
        this.isEmpty = true
        return
      }

      const P = Number(this.form.mortgage.replace(/,/g, ''))
      const n = Number(this.form.trem)
      const r = Number(this.form.rate)
      const i = r / 12 / 100
      const N = n * 12

      let monthly = 0
      let total = 0

      if (this.form.mortgageType === 'Repayment') {
        const factor = Math.pow(1 + i, N)
        monthly = P * i * factor / (factor - 1)
        total = monthly * N
      } else if (this.form.mortgageType === 'Interest Only') {
        monthly = P * i
        total = monthly * N + P
      }
      this.result.monthly = monthly.toFixed(2)
      this.result.total = total.toFixed(2)
      this.isEmpty = false
      this.$nextTick(() => {
        if (this.$refs.monthlyRef && this.$refs.totalRef) {
          this.animateNumber(this.$refs.monthlyRef, 0, Number(this.result.monthly))
          this.animateNumber(this.$refs.totalRef, 0, Number(this.result.total))
        }
      })
    },
    // donghua
    animateNumber (el, start, end) {
      const obj = { val: start }
      gsap.to(obj, {
        duration: 1.2,
        val: end,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = '£' + obj.val.toLocaleString('en-UK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }
      })
    },
    onKeyDown (event) {
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
        'Home', 'End', '.', ',', 'Enter'
      ]
      const isNumber = /^[0-9]$/.test(event.key)

      if (!isNumber && !allowedKeys.includes(event.key)) {
        event.preventDefault()
      }
    },
    clearAll () {
      this.form = {
        mortgage: '',
        trem: '',
        mortgageType: '',
        rate: ''
      }
      this.result = {
        monthly: 0,
        total: 0,
        interest: 0
      }
      this.isEmpty = true
      this.isError = {
        mortgage: false,
        trem: false,
        mortgageType: false,
        rate: false
      }
    }
  }
}
</script>

<style lang="less">
@import './styles/index.less';
</style>
