import { View, Text, Icon } from '@tarojs/components'
import { Button, Empty, Form, Input } from "@nutui/nutui-react-taro"
import { Eye, Marshalling } from '@nutui/icons-react-taro'
import { getCodeFromUrl } from '@/utils/utils'
import { subscribeNotify } from '@/api/business'
import Taro from '@tarojs/taro'
import styles from './bind.module.scss'
import { useState } from 'react'

function Index() {
  const code = getCodeFromUrl()
  const [bindStatus, setBindStatus] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'password'>('password')

  const submitSucceed = async (obj: any) => {
    try {
      const { data: { response_status } } = await subscribeNotify({
        open_code: code,
        phone: obj.tel,
        password: obj.password
      })
      if (response_status.code === 200) {
        Taro.showToast({
          title: '绑定成功',
          icon: 'none'
        })
        setBindStatus(true)
      } else {
        Taro.showToast({
          title: `绑定失败:${response_status.msg}`,
          icon: 'none'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '绑定失败,请稍后再试',
        icon: 'none'
      })
      console.error(error)
    }
  }

  const submitFailed = (error: any) => {
    console.error(error)
  }

  return (
    <View className={styles['page-content']}>
      {bindStatus ?
        <View className="index">
          <Empty
            title="绑定成功"
            description="已绑定完成，请等待审核工单下发"
            image={<><Icon size='60' type='success' /></>}
            imageSize={80}
          />
        </View> :
        <><View className="index">
          <Text>绑定账号</Text>
        </View>
          <Form
            className="index"
            onFinish={(obj) => submitSucceed(obj)}
            onFinishFailed={(error) => submitFailed(error)}
            footer={
              <>
                <Button nativeType="submit" block type="primary">
                  提交
                </Button>
              </>
            }
          >
            <View className={styles['form-password']}>
              <Form.Item label='账号' name="tel" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder='请填写账号，使用手机号即可' type="number" />
              </Form.Item>
            </View>
            <View className={styles['form-password']}>
              <Form.Item
                label='密码'
                name='password'
                required
              >
                <Input
                  type={inputType}
                  placeholder='请输入密码'
                />
              </Form.Item>
              <div
                onClick={() =>
                  setInputType(inputType === 'text' ? 'password' : 'text')
                }
              >
                {inputType === 'text' ? (
                  <Eye />
                ) : (
                  <Marshalling />
                )}
              </div>
            </View>
          </Form>
        </>
      }
    </View>
  )
}

export default Index
