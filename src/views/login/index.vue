<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">BAKN权限管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" class="login-btn" @click.native.prevent="handleLogin" data-title="登录"></el-button>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#ffffff;
  $light_gray:#283443;
  $cursor: #283443;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: white;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: white;
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#ffffff;
  $dark_gray:#889aa4;
  $light_gray:#283443;

  .login-container {
    min-height: 100%;
    width: 100%;
    background: url("http://image.minzhile.top/2019/2019-09/2019-09-10/41d0952f11f4f999da76fae242fdf465.jpg") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;

    .login-form {
      border-radius: 5px;
      background-color: white;
      position: relative;
      width: 380px;
      max-width: 100%;
      padding: 40px 35px 0;
      margin: 8% auto;
      overflow: hidden;

      .login-btn {
        position: relative;
        display: inline-block;
        padding: 1.2em 2em;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
        user-select: none;
        color: white;
        margin-bottom: 40px;
        width: 100%;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          border-radius: 4px;
          transition: box-shadow .5s ease, transform .2s ease;
          will-change: transform;
          box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
          transform:
            translateY(var(--ty, 0))
            rotateX(var(--rx, 0))
            rotateY(var(--ry, 0))
            translateZ(var(--tz, -12px));
        }

        &:hover::before {
          box-shadow: 0 5px 15px rgba(0, 0, 0, .3);
        }

        &::after {
          position: relative;
          display: inline-block;
          content: attr(data-title);
          transition: transform .2s ease;
          font-weight: bold;
          letter-spacing: .01em;
          will-change: transform;
          transform:
            translateY(var(--ty, 0))
            rotateX(var(--rx, 0))
            rotateY(var(--ry, 0));
        }
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        background-image: -webkit-linear-gradient(left,blue,#66ffff 10%,#cc00ff 20%,#CC00CC 30%, #CCCCFF 40%, #00FFFF 50%,#CCCCFF 60%,#CC00CC 70%,#CC00FF 80%,#66FFFF 90%,blue 100%);
        -webkit-text-fill-color: transparent;/* 将字体设置成透明色 */
        -webkit-background-clip: text;/* 裁剪背景图，使文字作为裁剪区域向外裁剪 */
        -webkit-background-size: 200% 100%;
        -webkit-animation: masked-animation 4s linear infinite;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
