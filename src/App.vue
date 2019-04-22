<template>
  <div id="app">
    <Waterfall :list="list" :gutter="10" :width="240" :phoneCol="2" @handleClick="handleClick" ref="waterfall">
      <template slot="item" scope="props">
        <div class="card">
          <div class="cover"><img :src="props.data.src" alt="" @load="$refs.waterfall.refresh()"></div>
          <div class="name">
            <p>{{props.data.name}}</p>
          </div>
        </div>
      </template>
    </Waterfall>
    <button @click="addNewList">加一个</button>
  </div>
</template>

<script>
import Waterfall from "./waterfall";
export default {
  name: 'app',
  data () {
    return {
      list: [],
    }
  },
  mounted() {
    this.list = [
       {
          src: "http://p.ssl.qhimg.com/t01724724fc9caa94bf.jpg",
          name: "场景一"
        },
        {
          src: "http://cs-op.douyucdn.cn/vod-index/2018/01/22/e21ebad16025f747b8bc96091042c900.jpg",
          name: "场景二"
        },
        {
          src: "http://p9.qhimg.com/t01447c917234911cf2.jpg",
          name: "场景三"
        },
        {
          src: "http://05.imgmini.eastday.com/mobile/20180212/20180212201510_0e27ec86ed59034f300f4e1d4aee8fd4_1.jpeg",
          name: "场景四"
        },
        {
          src: "http://img4.dwstatic.com/vhuyatv/1803/384953000949/1521011389431.jpg",
          name: "场景五"
        },
        {
          src: "http://img2.dwstatic.com/pc/1802/381422653510/1517467766942.jpg",
          name: "场景六"
        },
        {
          src: "http://i5.hexun.com/2018-02-01/192378386.jpg",
          name: "场景七"
        },
        {
          src: "http://i-3.yiwan.com/2018/1/29/46593a88-631b-4c58-865e-237bdff3f29a.jpg",
          name: "场景八"
        }
    ]
  },
  methods: {
    addNewList() {
      let list = [
        {
          src: "http://p.ssl.qhimg.com/t01724724fc9caa94bf.jpg",
          name: "场景一"
        },
        {
          src: "http://cs-op.douyucdn.cn/vod-index/2018/01/22/e21ebad16025f747b8bc96091042c900.jpg",
          name: "场景二"
        },
        {
          src: "http://p9.qhimg.com/t01447c917234911cf2.jpg",
          name: "场景三"
        },
        {
          src: "http://05.imgmini.eastday.com/mobile/20180212/20180212201510_0e27ec86ed59034f300f4e1d4aee8fd4_1.jpeg",
          name: "场景四"
        },
        {
          src: "http://img4.dwstatic.com/vhuyatv/1803/384953000949/1521011389431.jpg",
          name: "场景五"
        },
        {
          src: "http://img2.dwstatic.com/pc/1802/381422653510/1517467766942.jpg",
          name: "场景六"
        },
        {
          src: "http://i5.hexun.com/2018-02-01/192378386.jpg",
          name: "场景七"
        },
        {
          src: "http://i-3.yiwan.com/2018/1/29/46593a88-631b-4c58-865e-237bdff3f29a.jpg",
          name: "场景八"
        }
      ];
      this.list.push(...list)
    },
    handleClick(item) {
      alert()
      console.log(item)
    }
  },
  components: {
    Waterfall
  }
}
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
.card {
	border-radius: 5px;
	overflow: hidden;
	cursor: pointer;
	.cover {
		line-height: 0;
		img {
			width: 100%;
		}
	}
	.name {
		background: #f5f6fa;
		color: #666;
		font-weight: 600;
		padding: 10px 20px;
		font-size: 14px;
	}
}
</style>
