<?php

namespace App\Enums;

class ClientStatus
{
    const PROSPECT = 'prospect'; //見込み
    const ACTIVE = 'active'; //取引中
    const SUSPENDED = 'suspended'; //停止
    const CLOSED = 'closed'; //取引終了

    /**
     * 全ステータス一覧
     */
    public static function all()
    {
        return[
            self::PROSPECT,
            self::ACTIVE,
            self::SUSPENDED,
            self::CLOSED,
        ];
    }

    /**
     * 表示用ラベル
    */
    public static function labels()
    {
        return [
            self::PROSPECT => '見込み',
            self::ACTIVE => '取引中',
            self::SUSPENDED => '停止',
            self::CLOSED => '取引終了',
        ];
    }
}
