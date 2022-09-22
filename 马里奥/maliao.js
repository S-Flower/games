// 点击开始游戏
var starGame = document.querySelector('.stargame')
var map = document.querySelector('.map')
var guiCf = false//乌龟碰撞节流阀
var buttomBiamge = document.querySelector('.buttomBiamge')
var mark = document.querySelector('.mark')
var tips = document.querySelector('.tips')
document.onkeydown = function (e) {
    if (e.key == 'Enter') {
        starGame.style.display = 'none'
        map.style.display = 'block'
        buttomBiamge.style.display = 'block'
        mark.style.display = 'block'
        tips.style.display = 'block'
        active()
        guiMove()
    }
}
document.querySelector('.stargame span').onclick = function (e) {

    starGame.style.display = 'none'
    map.style.display = 'block'
    buttomBiamge.style.display = 'block'
    mark.style.display = 'block'
    tips.style.display = 'block'
    active()
    guiMove()
}
//玩家的状态
var player = {
    DOM: document.querySelector('.player'),

    dir: 'right', //方向 right右 left左
    score: 0,//玩家分数

    stand: 0, //站立状态 0 站立  1 行走
    moveV: 2,//人物移动速度

    jump: false,//false代表不起跳  true代表起跳
    jumpV: 7,//跳跃速度
    jumpHeight: 55,//人物跳跃的高度
    jumpFlag: 1,//人物 1代表上升 2代表下落
    isJumpIng: false,//人物是否跳起来了
    isBig: 'small',//false 代表不变大  true代表变大

    pipeTop: 0,//跳到管子上的高度
    pipeNum: null,//判断跳到当前的哪一个管子上

    width: 0,//人物宽度
    height: 0,//人物高度
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    imageNum: 2,//控制跑步图片是那一张
    // 更新坐标函数
    upDataXY: function () {
        this.width = this.DOM.offsetWidth
        this.height = this.DOM.offsetHeight
        this.x1 = this.DOM.offsetLeft
        this.x2 = this.DOM.offsetLeft + this.width

        this.y1 = this.DOM.style.bottom.replace('px', '') - 0
        this.y2 = this.y1 + this.height
    },
    // 跳跃函数
    jumpIng: function () {
        player.isJumpIng = true
        var _this = this
        var jumpTime = setInterval(function () {
            // 判断上升还是下降
            if (player.y1 <= player.pipeTop && player.jumpFlag == 2) {
                player.jump = false
                player.jumpFlag = 1
                guiCf = true//打开乌龟碰撞节流阀
                clearInterval(jumpTime)

                player.isJumpIng = false
                return
            }
            if (player.y1 >= player.jumpHeight + player.pipeTop) {
                player.jumpFlag = 2
                maxJumpHeight()
            }


            var go = player.y1 + 1 + 'px'
            var up = player.y1 - 1 + 'px'
            player.jumpFlag == 1 ? _this.DOM.style.bottom = go : _this.DOM.style.bottom = up

            _this.upDataXY()

        }, player.jumpV)

    },
    // 分数函数
    marks: function () {
        // 加分
        document.querySelector('.head .mark span').innerHTML = this.score += 100
        var buffBox = document.querySelector('.buff')
        // 判断新的分数是否大于旧的分数如果等于就人buff变大
        if (buffBox != null && player.score < 900) {
            // 变大蘑菇的体积
            buffBox.style.width = buffBox.offsetWidth + 4 + 'px'
            buffBox.style.height = buffBox.offsetWidth + 2 + 'px'
            var brick = document.querySelector('.brick')
            var fH = 20
            //判断蘑菇到多大开始移动
            if (buffBox.offsetWidth > brick.offsetWidth - 8) {
                // 让蘑菇移动
                var buffMove = setInterval(function () {
                    buffBox.style.left = buffBox.offsetLeft + 2 + 'px'
                    // 让蘑菇掉落停止运动  并让他摔出问好和变小
                    // 判断蘑菇的世界坐标
                    var worldBuff = brick.offsetLeft + (buffBox.style.left.replace('px', '') - 0)
                    var whereAbout = brick.offsetLeft + brick.offsetWidth
                    //判段蘑菇在什么时候下落  停止下落
                    if (worldBuff > whereAbout + 10 && fH > -60) {
                        fH -= 4
                        buffBox.style.bottom = fH + 'px'
                        // 是否到底
                        if (buffBox.style.bottom.replace('px', '') - 0 == -60) {
                            buffBox.style.width = 16 + 'px'
                            buffBox.style.height = 16 + 'px'
                            // 摔出问号箱子
                            var prPo = document.createElement('div')
                            prPo.classList.add('prPo')
                            brick.appendChild(prPo)
                            clearInterval(buffMove)
                        }
                    }
                }, 50)
                // 蘑菇落地后检测玩家坐标的定时器
                setTimeout(function () {
                    var prPoTime = setInterval(function () {
                        var prPo = document.querySelector('.prPo')
                        var brick = document.querySelector('.brick')
                        // 判断玩家是否碰到了问号
                        if (player.x2 >= prPo.offsetLeft + brick.offsetLeft && player.x2 <= brick.offsetLeft + prPo.offsetLeft + prPo.offsetWidth + player.width && player.jump == false) {
                            brick.removeChild(prPo)
                            player.die()
                        }
                        // 判断玩家是否碰到了蘑菇
                        if (player.x2 >= brick.offsetLeft + buffBox.offsetLeft && player.x2 <= brick.offsetLeft + buffBox.offsetLeft + buffBox.offsetWidth && player.jump == false) {
                            console.log('11');
                            // player.isBig = 'big'
                            brick.children[1].removeChild(buffBox)
                            brick.children[1].setAttribute('data-num', '1')
                            prPo.setAttribute('data-num', '0')
                            player.bigFun()
                        }
                    }, 50)

                }, 2000)

            }
        }

    },
    // 变大函数
    bigFun: function () {
        this.isBig = 'big'
        this.moveV = 3
        this.jumpHeight = 80
        this.jumpV = 5
        this.DOM.style.width = 20 + 'px'
        this.DOM.style.height = 23 + 'px'
    },
    //死亡函数
    die: function () {
        // 添加人物死亡动画
        player.DOM.classList.add('die')
        clearInterval(control)
        setTimeout(function () {
            location.reload()
            alert('作者:笨蛋')
        }, 2000)
    },
    // 管子上的下落函数
    piPeFlag: function () {
        var piPeFlag = setInterval(function () {
            // 下落改为下落状态
            player.jumpFlag = 2
            player.y1--
            player.DOM.style.bottom = player.y1 + 'px'
            if (player.y1 <= 0) {
                player.pipeTop = 0
                player.pipeNum = null
                player.DOM.style.bottom = 0 + 'px'
                // 改回不下落状态
                player.jumpFlag = 1
                clearInterval(piPeFlag)
                player.isJumpIng = false
            }
        }, 5)
    },
    // 攻击函数
    attackFun: function () {
        var fistDir = player.dir
        var attack = document.querySelector('.attack')
        // 创建图片
        var attack = document.createElement('img')
        attack.classList.add('attack')
        attack.src = `./images/fist_${this.dir}.png`
        player.DOM.appendChild(attack)
        // 获取坐标
        var op = 0.1
        var attackX = fistDir == 'left' ? -50 : 10
        var target = fistDir == 'left' ? 110 : 90
        var attackMove = setInterval(function () {

            fistDir == 'left' ? attackX-- : attackX++
            op += 0.02
            attack.style.left = attackX + 'px'
            attack.style.opacity = op
            if (Math.abs(attackX) >= target) {
                clearInterval(attackMove)
                player.DOM.removeChild(attack)
            }
            // 判断拳头是世界坐标
            var fisX = player.x1 + attackX + attack.offsetWidth
            var fisT = player.DOM.offsetTop + attack.offsetTop
            var r = brickWollF(fisX, fisT, 'x')
            console.log(fisX, fisT);
        }, 5)


    }
}

// 跳跃碰撞检测函数
function maxJumpHeight() {
    var brick = document.querySelector('.brick')

    var brickLeft = brick.offsetLeft
    for (var i of brick.children) {
        // 检测人物跟哪一个砖块碰撞了
        var itemX1 = brickLeft + i.offsetLeft
        var itemX2 = itemX1 + i.offsetWidth
        if (player.x2 >= itemX1 + 9 && player.x2 <= (itemX2 + i.offsetWidth - 9)) {

            // 加一个标记类查看金币数量
            var arr = i.getAttribute('data-num')
            // 判断是否有金币如果arr不为null则证明有金币
            if (arr == null) {
                // 如果已经有了蘑菇就不加了
                if (document.querySelector('.buff') != null) {
                    return
                }
                // 证明里面是蘑菇
                var buff = document.createElement('div')
                buff.classList.add('buff')
                i.appendChild(buff)
            } else {
                // 里面是金币  如果金币为零了就生成怪
                if (arr > 0) {
                    var money = document.createElement('div')
                    money.classList.add('money')
                    i.appendChild(money)
                    i.setAttribute('data-num', arr - 1)
                    // 移除金币盒子
                    setTimeout(function () {
                        i.removeChild(money)
                    }, 1000)
                    // 调用分数函数
                    player.marks()
                } else {
                    // 生成怪
                    new Monster(i)
                }
            }
            // 加上上顶动画   因为蘑菇只能有一个所以放在后面  让他在生成后不在发生上顶动画
            i.children[0].classList.add('wolA')
            setTimeout(function () {
                document.querySelector('.brick .wolA').classList.remove('wolA')
            }, 500)
            // 如果碰撞了就终止循环
            break
        }
    }

}
// 控制状态函数
function active() {
    player.upDataXY()

    document.onkeydown = function (e) {
        if (e.key == 'a') {
            player.stand = 1;
            player.dir = 'left'
        } else if (e.key == 'd') {
            player.stand = 1
            player.dir = 'right'
        } else if (e.key == 'j') {
            player.jump = true

        } else if (e.key == 'k') {
            var star = document.querySelector('.star')
            var starA = star.style.animation
            // console.log(starA);
            if (starA != '') {
                player.attackFun()
            }
        }
    }

    document.onkeyup = function (e) {
        if (e.key == 'a') {
            player.stand = 0;
            player.dir = 'left'
        } else if (e.key == 'd') {
            player.stand = 0
            player.dir = 'right'
        }
    }
}
// 控制怪的生成
function Monster(box) {
    // box 就是 跳跃碰撞检测函数的i

    var monster = document.createElement('div')
    monster.classList.add('monster')
    box.appendChild(monster)
    // 怪物移动
    var brick = document.querySelector('.brick')
    // var monster = document.querySelector('.brick .monster')
    var whereAboutH = 20
    var dirMonster = 1//判断怪物的方向 1代表向右 2代表向左
    var isOnWall = false//判断怪物是否落地 false没有落地  true落地了
    var pipe1 = document.querySelector('.pipe1')
    // 管子的世界坐标
    var pipe1X = pipe1.offsetLeft - monster.offsetWidth
    setTimeout(function () {
        var monsterMove = setInterval(function () {
            // 获取怪物最新的世界坐标 判段怪物在什么时候下落
            var worldMonster = brick.offsetLeft + (monster.style.left.replace('px', '') - 0)
            var whereAbout = brick.offsetLeft + brick.offsetWidth
            // 让怪物移动
            monster.style.left = dirMonster == 1 ? monster.offsetLeft + 2 + 'px' : monster.offsetLeft - 2 + 'px'
            // 如果怪物的世界坐标X大于了300就让 dirMonster=2
            if (worldMonster >= pipe1X) {
                dirMonster = 2
            }
            // 判断怪物什么时候出界
            if (-(monster.style.left.replace('px', '') - 0) == (brick.offsetLeft)) {
                box.removeChild(monster)
            }
            // 判段怪物在什么时候下落  停止下落
            if (worldMonster > whereAbout && whereAboutH > -60) {
                whereAboutH -= 4
                monster.style.bottom = whereAboutH + 'px'
            }
            // 判断怪物是否落地
            whereAboutH == -60 ? isOnWall = true : isOnWall = false
            // 判断怪物与人物碰撞
            if (player.x2 > worldMonster && player.x2 < worldMonster + monster.offsetWidth + player.width && player.y1 < monster.offsetHeight && isOnWall) {
                // 碰撞了要不玩家死要不怪物死
                if (player.jumpFlag == 2) {
                    // 增加怪物死亡的动画和移除怪物
                    monster.classList.add('monsterDie')
                    clearInterval(monsterMove)
                    setTimeout(function () {
                        box.removeChild(monster)
                    }, 400)
                    player.marks()
                    return
                } else {
                    player.die()
                }
            }
        }, 50)
    }, 750)

}

// 控制移动
var control = setInterval(function () {
    if (player.stand == 1) {
        // 走
        player.imageNum >= 7 && (player.imageNum = 2)
        var n = Math.floor(player.imageNum / 2)
        player.DOM.style.backgroundImage = `url(images/move_${player.isBig}_${player.dir}_${n}.png)`
        player.imageNum++
        // 移动
        var moveLeft = player.x1 - player.moveV + 'px'
        var moveRight = player.x1 + player.moveV + 'px'
        player.dir == 'left' ? player.DOM.style.left = moveLeft : player.DOM.style.left = moveRight
        player.upDataXY()
        //判断人物与管子的碰撞
        var pipes = document.querySelector('.pipes')
        for (var pipe of pipes.children) {
            //获取管子的坐标
            var pipeX1 = pipe.offsetLeft
            var pipeX2 = pipeX1 + pipe.offsetWidth
            var pipeY = pipe.offsetHeight
            // 判断玩家与管子的碰撞
            if (player.x2 >= pipeX1 && player.x2 <= pipeX2 + player.width) {
                // 如果玩家的方向左就是碰到了右边的管子
                if (player.dir == 'left') {
                    var newX = pipeX2
                } else {
                    var newX = pipeX1 - player.width
                }
                if (player.y1 >= pipeY) {
                    player.jumpFlag == 2 && (player.pipeTop = pipeY)
                    player.pipeNum = pipe
                } else {
                    player.DOM.style.left = newX + 'px'
                    player.x1 = newX
                }
                break
            }
        }
        // 判断玩家在哪一个管子上管子上下落
        if (player.pipeNum) {
            var pipeNumX1 = player.pipeNum.offsetLeft
            var pipeNumX2 = pipeNumX1 + player.pipeNum.offsetWidth
            if (player.x2 < pipeNumX1 || player.x1 > pipeNumX2) {
                //调用管子下落函数
                player.isJumpIng = true

                player.piPeFlag()
            }
        }
        // 判断玩家与墙和拳头的碰撞
        var r = brickWollF(player.x2, player.DOM.offsetTop)
        if (r && r.flag == true) {
            player.DOM.style.left = r.X - player.width - 1 + 'px'
        }
    } else {
        player.DOM.style.backgroundImage = `url(images/stand_${player.isBig}_${player.dir}.png)`
    }

    // 控制跳跃
    if (player.jump == true) {
        player.DOM.style.backgroundImage = `url(images/jump_${player.isBig}_${player.dir}.png)`
        if (player.isJumpIng == false) {
            player.jumpIng()
        }
    }

    // 星星函数
    // 获取星星的坐标
    var star = document.querySelector('.star')
    var starX = star.offsetLeft
    var sterY = starX + star.offsetWidth
    var bottombox = document.querySelector('.bottombox')
    // 判段玩家与星星的碰撞
    if (player.x2 > starX && player.x2 < sterY && player.jumpFlag == 2) {
        // 吃掉星星
        star.style.animation = 'none'
        // player.attackFun()
    }

}, 40)
// 乌龟移动
function guiMove() {
    var tortoisebox = document.querySelector('.tortoisebox')

    var guimoveT = setInterval(function () {
        // 找到每一个乌龟
        for (let gui of tortoisebox.children) {
            // 乌龟的速度
            gui.guiMoveV = 2
            // 找到乌龟的坐标
            var guiX1 = gui.offsetLeft
            var guiWordX = gui.offsetLeft + tortoisebox.offsetLeft
            // 判断乌龟什么时候掉头
            if (guiX1 <= 0) {
                gui.classList.remove('left')
                gui.classList.add('right')
            }
            if (guiX1 >= 241) {
                gui.classList.remove('right')
                gui.classList.add('left')
            }
            // 判断乌龟身上的死亡类
            var n = gui.getAttribute('data-die')
            if (n == 3 || n == 4) {
                gui.guiMoveV = 6
            }
            if (n == 2) {
                gui.classList.add('tDie')
                //一秒后在移除死亡类
            } else {
                // 让乌龟动起来 并且判断乌龟往那边走
                if (gui.className.indexOf('right') != -1) {
                    guiX1 += gui.guiMoveV
                } else {
                    guiX1 -= gui.guiMoveV
                }
                gui.style.left = guiX1 + 'px'


            }
            // 判断玩家与乌龟的碰撞
            if (guiCf && player.x2 >= guiWordX && player.x2 <= guiWordX + player.width) {
                if (player.jumpFlag == 2 && player.y1 < 24) {
                    guiCf = false
                    // 判断龟身上的类型
                    if (n == 2) {
                        gui.setAttribute('data-die', 3)
                        setTimeout(function () {
                            gui.setAttribute('data-die', 4)
                        }, 500)
                    }
                    if (n == 1) {
                        gui.setAttribute('data-die', 2)
                    }
                } else if (player.jumpFlag != 2 && player.y1 < 24 && n != 2 && n != 3) {
                    player.die()
                }
            }
        }
    }, 40)

    // 乌龟发射器

    var guiLaunchT = setInterval(function () {
        guiLaunchTFun()
    }, 1500)
}
// 乌龟发射
function guiLaunchTFun() {
    var launchT = document.querySelector('.launchT')
    // var gui3 = document.querySelector('')
    var gui = document.createElement('div')
    gui.classList.add('gui')
    launchT.appendChild(gui)
    var gui3Move = setInterval(function () {
        gui.style.left = gui.offsetLeft - 3 + 'px'
        if (gui.offsetLeft <= -265) {
            clearInterval(gui3Move)
            launchT.removeChild(gui)
        }
        // 判断碰撞
        var gui3X1 = launchT.offsetLeft + gui.offsetLeft
        var gui3X2 = gui3X1 + player.width
        if (player.y1 < gui.offsetHeight && player.x2 > gui3X1 && player.x2 < gui3X2) {
            player.die()
        }
    }, 3)
}
// 判断玩家与墙和拳头的碰撞
function brickWollF(right, top, type) {
    var brickWoll = document.querySelector('.brickWoll')
    var brickWollImg = document.querySelectorAll('.brickWoll img')
    var brickWollImg = [...brickWollImg].reverse()
    for (var i of brickWollImg) {
        var iX = brickWoll.offsetLeft + i.offsetLeft
        var iY = brickWoll.offsetTop + i.offsetTop + i.offsetHeight
        if (right > iX && top < iY) {
            console.log(i);
            if (type == 'x') {
                i.parentNode.removeChild(i)
            }
            return {
                flag: true,
                X: iX
            }
        }

    }

}
// 生成砖块强
var brickWoll = document.querySelector('.brickWoll')
for (var i = 0; i <= 8; i++) {
    var div = document.createElement('div')
    for (var t = 0; t <= 8; t++) {
        // var div = document.querySelector('.brickWoll div')
        var img = document.createElement('img')
        div.appendChild(img)
        img.src = 'images/block_03.png'
    }
    brickWoll.appendChild(div)
}


