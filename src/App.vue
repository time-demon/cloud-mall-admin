<template>
  <div id="app" :class="mobile?'mobile':''">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobile: false
    }
  },
  mounted() {
    // const ignore = ['src\\components', 'src\\views']
    // for (const str on ignore) {
    //   console.log(str);
    // }
    if (document.body.clientWidth <= 750) {
      this.mobile = true
    }
    window.onresize = () => {
      if (document.body.clientWidth <= 750) {
        this.mobile = true
      }
    }
  },
}
</script>

<style lang="scss">
.mobile {

  >.allBox {
    >.header {
      >.headerBox {
        >.headerLeft {
          width: 130px;

          >.adminTitle {
            >h1 {
              font-size: 16px;
            }
          }

          >.allFormBox {
            display: none !important;
          }
        }

        >.headerRight {
          >.rightBox:nth-of-type(1) {
            display: none;
          }
        }
      }
    }

    >.nav {
      overflow-x: scroll;

      >.navBox {
        width: max-content;

        >.bigNav {
          width: 120px;
        }
      }
    }

    >.webPageBox {
      >.dataBox1 {
        >.pageTitle {
          display: block !important;
          // line-height: inherit !important;

          >p {
            font-size: 18px;
          }

          >p:nth-of-type(1) {
            display: none;
          }
        }

        >.dataBox2 {
          display: block !important;

          >.updateNotice {
            width: 100% !important;
            padding: 0 !important;
          }

          >.panelBox {
            >.panel-shortBox {
              grid-template-columns: repeat(auto-fill, 170px) !important;
            }
          }
        }
      }

      .mainBox {

        >.operationBox {
          >.goodsListForm {
            display: block !important;

            >form {
              >div:nth-of-type(3) {
                display: none;
              }

              >div:nth-last-child(1) {
                float: left;
              }
            }
          }
        }
      }
    }
  }

  .el-dialog__wrapper {
    width: 100vw;
    height: 100vh;

    >.el-dialog {
      width: 95vw;
      height: 95vh;
    }

  }
}

@media screen and (max-width:750px) {
  .el-message-box__wrapper {
    width: 100vw;

    >.el-message-box {
      width: 95vw;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

li {
  list-style: none;
}

#app {
  font-family: 14px Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  width: 100%;
  height: 100%;
  min-height: 100% !important;
}

.my-dialog {
  margin: 0 !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
