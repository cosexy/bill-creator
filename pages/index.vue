<template>
  <div class="flex">
    <div class="w-[600px]">

      <div class="mb-5">
        <button
            v-for="item in lists"
            :key="item"
            class="text-white px-3 py-1.5 rounded-md uppercase mr-4"
            :class="{
              'bg-primary-600': activeBank === item,
              'bg-gray-300': activeBank !== item,
            }"
            @click="activeBank = item"
        >
          {{ item }}
        </button>
      </div>

      <n-form class="max-w-[500px]">

        <n-form-item label="Trạng thái">
          <n-switch v-model:value="isSuccess" />
          <span class="ml-4">
            Thành công
          </span>
        </n-form-item>

        <n-form-item label="Sóng">
          <div class="_status_btn" :class="activeBank">

            <button
                v-for="item in statusBarResource.network"
                :key="item.value"
                class="cursor-pointer transition"
                :class="{
                    'opacity-50': statusBar.network !== item.value,
                  }"
                @click="statusBar.network = item.value"
            >
              <img :src="item.value" alt="" />
            </button>

          </div>
        </n-form-item>

        <n-form-item label="Wifi">
          <div class="_status_btn" :class="activeBank">

            <button
                v-for="item in statusBarResource.wifi"
                :key="item.value"
                class="cursor-pointer transition"
                :class="{
                    'opacity-50': statusBar.wifi !== item.value,
                  }"
                @click="statusBar.wifi = item.value"
            >
              <img :src="item.value" alt="" />
            </button>

          </div>
        </n-form-item>

        <n-form-item label="Pin">
          <div class="_status_btn" :class="activeBank">

            <button
                v-for="item in statusBarResource.battery"
                :key="item.value"
                class="cursor-pointer transition"
                :class="{
                    'opacity-50': statusBar.battery !== item.value,
                  }"
                @click="statusBar.battery = item.value"
            >
              <img :src="item.value" alt="" />
            </button>

          </div>
        </n-form-item>

        <n-form-item label="Số tiền">
          <n-input-number v-model:value="banks[activeBank].config.amount.value" />
        </n-form-item>
        <n-form-item label="Người hưởng thụ">
          <n-input v-model:value="banks[activeBank].config.name.value" />
        </n-form-item>

        <n-form-item label="Số tài khoản">
          <n-input v-model:value="banks[activeBank].config.account.value" />
        </n-form-item>

        <n-form-item label="Ngân hàng hưởng thụ">
          <n-select
              v-model:value="banks[activeBank].config.bank.value"
              :options="bankOptions"
              placeholder="Chọn ngân hàng hưởng thụ"
              filterable
          />
        </n-form-item>

        <n-form-item label="Mã giao dịch">
          <n-input v-model:value="banks[activeBank].config.id.value" />
        </n-form-item>

        <n-form-item label="Nội dung">
          <n-input v-model:value="banks[activeBank].config.note.value" />
        </n-form-item>
      </n-form>

      <div class="flex">
        <n-button type="info" @click="copyImage">
          Sao Chép
        </n-button>

        <div class="w-3"></div>

        <n-button type="info" @click="exportImage">
          Tải Xuống
        </n-button>
      </div>
    </div>
    <div class="w-[280px]">
      <creator-bill
          ref="billRef"
          :config="config"
          :image="image"
          :class="{
             'text-white': activeBank === 'vcb',
             'text-black': activeBank === 'tech',
             [activeBank]: true
          }"
      >

        <div class="status_right">
          <img
              v-for="item in Object.entries(statusBar)"
              :class="item[0]"
              :src="item[1]"
              alt=""
          />
        </div>

      </creator-bill>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toBlob } from 'html-to-image'
import download from 'downloadjs'
import {BankCreatorProps} from "~/entities/creator.entity"
import {IBank} from "~/entities/bank.entity";
import {SelectMixedOption} from "naive-ui/es/select/src/interface"

const lists = ref(['vcb', 'tech'])
const activeBank = ref('vcb')

const res = await useFetch<{
  data: IBank[]
}>('https://api.vietqr.io/v2/banks')
const vnBanks = computed(() => res.data.value?.data || [])
// covert to comlumns
const bankOptions = computed<SelectMixedOption[]>(() => {
  return vnBanks.value.map((item: any) => {
    return {
      label: item.shortName,
      value: String(item.name)
    }
  })
})

const statusBar  = reactive({
  network: '/images/vcb/bt1.png',
  wifi: '/images/vcb/wifi1.png',
  battery: '/images/vcb/btr1.png',
})

const statusBarResource = computed(() => ({
  network: Array(4).fill('').map((_, index) => ({
    value: `/images/${activeBank.value}/bt${index + 1}.png`,
    label: `Sóng ${index + 1} Vạch`,
  })),
  wifi: Array(3).fill('').map((_, index) => ({
    value: `/images/${activeBank.value}/wifi${index + 1}.png`,
    label: `Wifi ${index + 1} Vạch`,
  })),
  battery: [
    {
      label: 'Đang sạc',
      value: `/images/${activeBank.value}/btr1.png`
    },
    {
      label: 'Pin yếu',
      value: `/images/${activeBank.value}/btr2.png`
    },
    {
      label: 'Pin 90%',
      value: `/images/${activeBank.value}/btr3.png`
    },
    {
      label: 'Nguồn điện thấp',
      value: `/images/${activeBank.value}/btr4.png`
    }
  ]
}))

const banks = reactive<Record<string, BankCreatorProps>>({
  vcb: {
    image: ['/images/banks/vcb.jpg', '/images/banks/vcb2.jpg'],
    config: {
      amount: {
        value: 12000000,
        style: {
          top: '170px',
          right: '0px',
          left: '0px',
          justifyContent: 'center',
          color: '#7cc40c',
          fontSize: '16px',
          fontWeight: 500,
        },
      },
      name: {
        value: '',
        style: {
          top: '226px',
          right: '10px',
          fontSize: '11px',
          fontWeight: 500,
          width: '150px',
          justifyContent: 'flex-end',
          height: '39px'
        },
      },
      account: {
        value: '',
        style: {
          top: '265px',
          right: '10px',
          fontSize: '11px',
          fontWeight: 500,
          width: '150px',
          height: '38px',
          justifyContent: 'flex-end',
        },
      },
      bank: {
        value: '',
        style: {
          top: '303px',
          right: '10px',
          width: '140px',
          height: '51px',
          justifyContent: 'flex-end',
          fontSize: '11px',
          maxWidth: '160px',
          fontWeight: 500,
          lineHeight: 'normal',
          whiteSpace: 'pre-line',
          textAlign: 'right'
        },
      },
      id: {
        value: '',
        style: {
          top: '353px',
          right: '10px',
          height: '39px',
          textAlign: 'right',
          fontSize: '11px',
          maxWidth: '200px',
          fontWeight: 500
        },
      },
      note: {
        value: '',
        style: {
          top: '392px',
          right: '10px',
          textAlign: 'right',
          fontSize: '11px',
          maxWidth: '160px',
          lineHeight: 'normal',
          fontWeight: 500,
          height: '50px'
        },
      }
    }
  },
  tech: {
    image: ['/images/banks/tech.jpg', '/images/banks/tech2.jpg'],
    config: {
      amount: {
        value: 100000,
        style: {
          top: '236px',
          left: '16px',
          fontSize: '18px',
          fontWeight: 600,
        },
      },
      name: {
        value: '',
        style: {
          top: '195px',
          left: '16px',
          fontSize: '18px',
          fontWeight: 600,
          whiteSpace: 'pre-line',
          lineHeight: 'normal'
        },
      },
      account: {
        value: '1013277752',
        style: {
          top: '265px',
          right: '10px',
          fontSize: '11px',
          fontWeight: 500,
          width: '150px',
          height: '38px',
          justifyContent: 'flex-end',
        },
      },
      bank: {
        value: '',
        style: {
          top: '298px',
          left: '16px',
          right: '16px',
          fontSize: '11px',
          fontWeight: 500,
          lineHeight: 'normal',
          wordSpacing: '-1.5px',
          whiteSpace: 'pre-line'
        },
      },
      id: {
        value: '',
        style: {
          top: '444px',
          left: '16px',
          right: '16px',
          textAlign: 'right',
          fontSize: '11px',
          maxWidth: '160px',
          lineHeight: 'normal',
          fontWeight: 500,
        },
      },
      note: {
        value: '',
        style: {
          top: '355px',
          left: '16px',
          right: '16px',
          textAlign: 'right',
          fontSize: '11px',
          maxWidth: '160px',
          lineHeight: 'normal',
          fontWeight: 500
        },
      }
    }
  }
})

const currentBank = computed(() => vnBanks.value.find((item: any) => item.name === banks[activeBank.value].config.bank.value))

watch(activeBank, (val) => {
  if(val) {
    statusBar.network = statusBarResource.value.network[0].value
    statusBar.battery = statusBarResource.value.battery[0].value
    statusBar.wifi = statusBarResource.value.wifi[0].value
  }
})
const { $dayjs, $moneyFormat } = useNuxtApp()

const config = computed(() => {
  const _config = JSON.parse(JSON.stringify(banks[activeBank.value].config))
  if(activeBank.value === 'vcb') {
    _config.time = {
      value: $dayjs().format('HH:mm dddd DD/MM/YYYY'),
      style: {
        top: '195px',
        right: '0px',
        left: '0px',
        textTransform: 'capitalize',
        justifyContent: 'center',
        color: '#8c959b',
        fontSize: '8px',
        fontWeight: 500
      }
    }
    if(currentBank.value) {
      // find all TMCP and remove and capitalize
      // remove Việt Nam in last
      const _bank = currentBank.value?.name.replace(/\s(TMCP)\s/g, ' ')
          .split(' ')
          .map((item: string) => item.charAt(0).toUpperCase() + item.slice(1))
          .join(' ')
          .replace('Hàng', 'hàng')
          .replace(/Việt Nam$/, '')

      _config.bank.value = _bank + `\n(${currentBank.value?.code})`
    }
    _config.amount.value = $moneyFormat(_config.amount.value || 0) + ' VND'
  } else if (activeBank.value === 'tech') {
    // covert to string and group 4 number
    _config.bank.value = _config.bank.value + '\n' + String(_config.account.value).replace(/(\d{4})/g, '$1 ')
    delete _config.account

    _config.name.value = (isSuccess.value ? 'Chuyển thành công' : 'Chuyển thất bại') + '\n tới ' + String(_config.name.value).toUpperCase()
    _config.amount.value = 'VND ' + $moneyFormat(_config.amount.value || 0)

    _config.time = {
      value: $dayjs().format('D MMMM, YYYY'),
      style: {
        top: '400px',
        left: '16px',
        right: '16px',
        textAlign: 'right',
        fontSize: '11px',
        maxWidth: '160px',
        lineHeight: 'normal',
        fontWeight: 500
      }
    }
  }
  return _config
})

const [isSuccess, toggleSuccess] = useToggle(true)
const image = computed(() => banks[activeBank.value].image[isSuccess.value ? 0 : 1])


/**
 * Dowloadng image
 */
const billRef = ref()
const { width, height } = useElementSize(billRef)

const copyImage = async () => {
  if(!billRef.value) {
    return
  }

  const _file = await toBlob(billRef.value.$el, {
    canvasWidth: 600,
    canvasHeight: 600 * (height.value / width.value),
  })
  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': _file!
    })
  ]);
}
const exportImage = async () => {
  if(!billRef.value) {
    return
  }

  const _file = await toBlob(billRef.value.$el, {
    canvasWidth: 600,
    canvasHeight: 600 * (height.value / width.value),
  })
  if(_file) {
    download(_file, 'bill.png')
  }
}

</script>

<style>
._bill_creator.tech ._clock {
  top: 8px;
  left: 34px;
  font-size: 11px;
  font-weight: 600;
}

._status_btn {
  display: flex;
}

._status_btn > button img {
  height: 20px;
}

._status_btn > button {
  padding: 10px;
}

._status_btn.vcb > button {
  background: #0d1e25;
}

._status_btn.vcb > button {
  background: #0d1e25;
  padding: 10px;
  border-radius: 15px;
  margin-right: 15px;
}

.status_right {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  top: 10px;
  right: 14px;
}

.status_right > img {
  height: 9px;
}

.status_right ._bt {
  height: 8px;
}

.status_right > .wifi {
  margin: 0 3px;
}

._bill_creator.tech .status_right {
  right: 16px;
}

._bill_creator.tech .status_right > img {
  height: 8px;
}
</style>
