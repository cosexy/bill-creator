<template>
  <div class="w-full h-full flex items-center justify-center">
    <n-form
        ref="formRef"
        :model="from"
        :rules="rules"
        class="w-[300px]"
    >
      <n-form-item path="email" label="Số Điện Thoại">
        <n-input v-model:value="from.email" />
      </n-form-item>
      <n-form-item path="password" label="Mật Khẩu">
        <n-input
            v-model:value="from.password"
            type="password"
        />
      </n-form-item>
      <div class="flex justify-end">
        <n-button
            round
            type="primary"
            @click="onSubmit"
        >
          Đăng Nhập
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import {FormRules} from "naive-ui/es/form/src/interface"
import {FormInst} from "naive-ui";
import {SignInInput} from "~/apollo/__generated__/serverTypes";
/**
 * Section: Form Setup
 */
const formRef = ref<FormInst>()
const message = useMessage()

const from = reactive<SignInInput>({
  email: '',
  password: ''
})

const isAdmin = useCookie('isAdmin')
const onSubmit = async () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      return message.error('Vui lòng nhập đầy đủ thông tin')
    }
  })

  if (from.email === 'admin' && from.password === 'admin@@') {
    message.success('Đăng nhập thành công')
    isAdmin.value = '1'
    window.location.reload()
  }
}

// validate email and password
const rules = computed<FormRules>(() => ({
  email: [
    {
      required: true,
      message: 'Vui lòng nhập số điện thoại'
    }
  ],
  password: [
    {
      required: true,
      message: 'Vui lòng nhập mật khẩu'
    },
    {
      min: 6,
      message: 'Mật khẩu phải có ít nhất 6 ký tự'
    }
  ]
}))
</script>

<style scoped></style>
