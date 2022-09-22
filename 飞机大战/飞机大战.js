// 通过类来创建玩家飞机有三条命
// var player = document.querySelector('.player')
var playGame = document.querySelector('.playGame')
var button = document.querySelector('.playGame .button')
var gameBox = document.querySelector('.gameBox')
var active = document.querySelector('.active')
var gameBox = document.querySelector('.gameBox')
var enemy_blowup = document.querySelector('.enemy_blowup')
var fire = document.querySelector('.fire')
var bgMusic = document.querySelector('.bgMusic')
// 敌人数组
var enemyArr = []
// 敌人1的死亡动画数组
var enemy1Die = [
    'enemy1_down1',
    'enemy1_down2',
    'enemy1_down3',
    'enemy1_down4'
]
// 敌人2的死亡动画数组
var enemy2Die = [
    'enemy2_down1',
    'enemy2_down2',
    'enemy2_down3',
    'enemy2_down4'
]
// 敌人3的死亡动画数组
var enemy3Die = [
    'enemy3_down1',
    'enemy3_down2',
    'enemy3_down3',
    'enemy3_down4',
    'enemy3_down5',
    'enemy3_down6'
]
// 禁止选中
button.onselectstart = function (e) {
    // 阻止选中的默认行为
    e.preventDefault()
}
document.querySelector('.playHp').onselectstart = function (e) {
    e.preventDefault()
}
document.onselectstart = function (e) {
    e.preventDefault()
}
// 开始游戏
button.onclick = function () {
    bgMusic.play()
    gameBox.style.display = 'block'
    playGame.style.display = 'none'
    // 创建敌人1的时间
    setInterval(function () {
        var speed = Math.floor(Math.random() * 5 + 2)
        // console.log(speed);
        var enemy = new enemy1(2, speed, 'enemy1', enemy1Die)
        enemyArr.push(enemy)
    }, 1500)
    // 创建敌人2的时间
    setInterval(function () {
        var speed = Math.floor(Math.random() * 3 + 2)
        var enemy = new enemy2(4, speed, 'enemy2', enemy2Die, 'bullet2')
        enemyArr.push(enemy)
    }, 3000)
    // 创建敌人3
    setTimeout(function () {
        var enemy = new enemy3(50, 0, 'enemy3', enemy3Die, 'bullet3')
        enemyArr.push(enemy)
    }, 120000)

    // 发射子弹
    setInterval(function () {
        if (playerP.hp <= 0) {
            return
        } screenLeft
        playerP.fire()
    }, 150)
}
// 玩家的创建
class player {
    constructor(hp) {
        this.hp = hp//生命值
        //创建玩家飞机
        this.upDateHp(0)
        this.DOM = document.createElement('div')
        this.DOM.classList.add('player')
        active.appendChild(this.DOM)
        var _this = this
        // 检测玩家飞机的事件 鼠标按下
        this.DOM.onmousedown = function () {
            active.addEventListener('mousemove', _this.PlanMove)
        }
        // 检测玩家飞机 鼠标松开事件
        this.DOM.onmouseup = function () {
            active.removeEventListener('mousemove', _this.PlanMove)
        }
        this.PlanMove = function (e) {

            // 获取鼠标在游戏区域的坐标
            var mouseX = e.pageX - gameBox.offsetLeft
            var mouseY = e.pageY - gameBox.offsetTop
            // 玩家的坐标
            _this.DOM.style.left = mouseX - 35 + 'px'
            _this.DOM.style.top = mouseY - 37 + 'px'
        }

    }
    // 开火
    fire() {
        var audio = document.createElement('audio')
        audio.src = 'audio/fire.mp3'
        audio.play()
        var bullet = document.createElement('div')
        bullet.classList.add('bullet')
        active.appendChild(bullet)
        bullet.style.top = this.DOM.offsetTop - 10 + 'px'
        bullet.style.left = this.DOM.offsetLeft + (this.DOM.offsetWidth / 2) - 4 + 'px'
        // 子弹移动
        var bulletTime = setInterval(function () {
            bullet.style.top = bullet.offsetTop - 4 + 'px'
            if (bullet.offsetTop <= 0) {
                clearInterval(bulletTime)
                bullet.parentNode.removeChild(bullet)
            }
            // 判断碰撞
            // 获取子弹的坐标
            var bulletX1 = bullet.offsetLeft
            var bulletX2 = bulletX1 + bullet.offsetWidth
            var bulletTop = bullet.offsetTop
            var bulletBottom = bulletTop + bullet.offsetHeight

            // 循环敌人数组
            for (var item of enemyArr) {
                // console.log(item.DOM);
                var itemX1 = item.DOM.offsetLeft
                var itemX2 = item.DOM.offsetWidth + itemX1
                var itemTop = item.DOM.offsetTop + item.DOM.offsetWidth
                var itemBottom = item.DOM.offsetTop

                if (bulletX2 > itemX1 && bulletX1 < itemX2 && bulletTop < itemTop && bulletBottom > itemBottom) {
                    bullet.parentNode.removeChild(bullet)
                    clearInterval(bulletTime)
                    item.changeHp()
                    break
                }
            }
        }, 10)

    }
    upDateHp(num) {
        this.hp = this.hp + num
        var strHp = ''
        // 循环创建血条
        for (var i = 0; i < this.hp; i++) {
            strHp += '♥'
        }
        document.querySelector('.playHp').innerHTML = strHp
        // 判断死亡
        if (this.hp <= 0) {
            var _this = this
            var index = 1
            var die = setInterval(function () {
                var url = `imgs/hero_blowup_n${index}.png`
                _this.DOM.style.background = 'url(' + url + ')'
                _this.DOM.style.backgroundSize = '100% 100%'
                index++
                if (index >= 5) {
                    document.querySelector('.hero_blowup').play()
                    clearInterval(die)
                    _this.DOM.parentNode.removeChild(_this.DOM)
                }
                setTimeout(function () {
                    location.reload()
                }, 2000)
            }, 100)
        }
    }
}
// 敌人1的创建
class enemy1 {
    constructor(hp, downSpeed, className, enemyDieBg) {
        this.hp = hp//血量
        this.downSpeed = downSpeed//敌人速度
        this.enemyDieBg = enemyDieBg
        // 创建敌人
        var enemy1 = document.createElement('div')
        this.DOM = enemy1
        enemy1.className = `enemy ${className}`
        // 敌人随机出现的位置
        enemy1.style.left = Math.floor(Math.random() * (className == 'enemy3' ? 335 : 450)) + 'px'
        active.appendChild(enemy1)
        var _this = this
        var clearEnemy = setInterval(function () {
            enemy1.style.top = enemy1.offsetTop + downSpeed + 'px'
            // 超出范围就自毁
            if (enemy1.offsetTop > 670 && _this.hp > 0) {
                // 超出活动范围手动归零
                _this.die()
                _this.hp = -1
                enemy1.parentNode.removeChild(enemy1)

            }

            // 判断enemy1的与玩家的碰撞
            // 玩家坐标
            var playX1 = playerP.DOM.offsetLeft
            var playX2 = playerP.DOM.offsetWidth + playX1
            var playY1 = playerP.DOM.offsetTop
            var playY2 = playerP.DOM.offsetHeight + playY1
            // enemy1坐标
            var enemy1X1 = enemy1.offsetLeft
            var enemy1X2 = enemy1X1 + enemy1.offsetWidth
            var enemy1Y1 = enemy1.offsetTop
            var enemy1Y2 = enemy1Y1 + enemy1.offsetHeight
            if (enemy1X2 > playX1 && enemy1X1 < playX2 && playY1 < enemy1Y2 && playY2 > enemy1Y1) {
                // if (className == 'enemy3') {
                //     playerP.upDateHp(-_this.hp)
                //     clearInterval(clearEnemy)
                //     return
                // }
                className == 'enemy3' ? playerP.upDateHp(-_this.hp) : playerP.upDateHp(-1)
                className == 'enemy2' ? _this.hp = 0 : ''

                clearInterval(clearEnemy)
                _this.die()
            }
        }, 20)
    }
    die() {
        // 播放死亡音乐
        var audio = document.createElement('audio')
        audio.src = 'audio/enemy_blowup.mp3'
        audio.play()
        var _this = this
        var index = 0
        var die = setInterval(function () {
            // 判断是否是最后一张图
            if (index == _this.enemyDieBg.length) {
                if (_this.DOM.parentNode != null) {
                    _this.DOM.parentNode.removeChild(_this.DOM)
                    clearInterval(die)
                    return
                }
            }
            var url = 'imgs/' + _this.enemyDieBg[index] + '.png'
            _this.DOM.style.background = 'url(' + url + ')'
            index++

        }, 100)

    }
    changeHp() {
        this.hp--
        if (this.hp == 0) {
            this.die()
        }
    }
}
// 敌人2的创建继承敌人一
class enemy2 extends enemy1 {
    constructor(hp, downSpeed, className, enemyDieB, bulletT) {
        super(hp, downSpeed, className, enemyDieB)
        var _this = this

        this.bulletT = bulletT

        var fireTime = setInterval(function () {
            // 如果敌人二死亡了就不开火了
            if (_this.hp <= 0) {
                clearInterval(fireTime)
                return
            }
            _this.fire(bulletT)
        }, className == 'enemy3' ? 500 : 700)

    }
    fire(bulletT) {

        var bullet = document.createElement('div')
        bullet.classList.add(bulletT)
        active.appendChild(bullet)
        bullet.style.top = this.DOM.offsetTop + this.DOM.offsetHeight + 'px'
        bullet.style.left = this.DOM.offsetLeft + (this.DOM.offsetWidth / 2) - (bullet.offsetWidth / 2) + 'px'
        // 子弹移动
        var bulletTime = setInterval(function () {
            bullet.style.top = bullet.offsetTop + 4 + 'px'
            if (bullet.offsetTop >= 670) {
                clearInterval(bulletTime)
                console.log();
                bullet.parentNode.removeChild(bullet)
            }
            // 判断碰撞
            // 获取子弹的坐标
            var bulletX1 = bullet.offsetLeft
            var bulletX2 = bulletX1 + bullet.offsetWidth
            var bulletTop = bullet.offsetTop
            var bulletBottom = bulletTop + bullet.offsetHeight
            // 获取玩家坐标
            var playX1 = playerP.DOM.offsetLeft
            var playX2 = playerP.DOM.offsetWidth + playX1
            var playY1 = playerP.DOM.offsetTop
            var playY2 = playerP.DOM.offsetHeight + playY1
            if (bulletX2 > playX1 && bulletX1 < playX2 && bulletBottom < playY2 && bulletTop > playY1) {
                playerP.upDateHp(-1)
                clearInterval(bulletTime)
                bullet.parentNode.removeChild(bullet)
            }
        }, 10)

    }
}
// 敌人3的创建
class enemy3 extends enemy2 {
    constructor(hp, downSpeed, className, enemyDieBg, bulletT) {
        super(hp, downSpeed, className, enemyDieBg, bulletT)
        var _this = this
        var dir = 'right'
        var bossMove = setInterval(function () {
            var playX = playerP.DOM.offsetLeft
            var bossX = _this.DOM.offsetLeft
            if (bossX <= 10) {
                dir = 'right'
            }
            if (bossX >= 325) {
                dir = 'left'
            }
            var move = dir == 'right' ? _this.DOM.offsetLeft + 5 : _this.DOM.offsetLeft - 5
            _this.DOM.style.left = move + 'px'
            if (_this.hp <= 0) {
                document.querySelector('.bowbig').play()
                clearInterval(bossMove)
                setTimeout(function () {

                    location.reload()
                    alert('恭喜通关')
                }, 1000)
            }
        }, 50)

    }
}
var playerP = new player(5)


