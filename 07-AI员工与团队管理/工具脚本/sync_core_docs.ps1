# 飞书增量同步脚本 - PowerShell版本
# 解决Python编码问题

$env:HTTPS_PROXY = ""
$env:HTTP_PROXY = ""

$LARK_CLI = "C:\Users\Administrator\.openclaw\skills\node24\lark-cli.cmd"

# 核心文档映射
$coreMapping = @(
    @{name="A02-USER"; localPath="C-记忆核心\01-个人上下文\A02-USER.md"; token="WXEhd7F6co1Js3xa5b8cey0AnXe"},
    @{name="A03-MEMORY"; localPath="C-记忆核心\04-迭代记忆\A03-MEMORY.md"; token="WU3qdlLfRo8lxnxZSlfcDvUZnWf"},
    @{name="A04-INVENTORY"; localPath="C-记忆核心\01-个人上下文\A04-INVENTORY.md"; token="Cp6ldTFqVoFWRUxeB6ocfYGAnOc"},
    @{name="A05-周工作区"; localPath="C-记忆核心\01-个人上下文\A05-周工作区.md"; token="NyNPdSZrpomUpkx6hmEcdW1XnRh"},
    @{name="A06-每日复盘日志"; localPath="C-记忆核心\01-个人上下文\A06-每日复盘日志.md"; token="CKnYdL8f0ot9bFxDpPscTnVKntg"},
    @{name="B01-素材库"; localPath="D-内容创作\03-素材库\B01-素材库.md"; token="EvbFdAS1gogWDGxUpYMc00jznR6"},
    @{name="B02-选题决策"; localPath="D-内容创作\02-选题决策\B02-选题决策.md"; token="Ed5sdJRVdoTsW9x12ijc7Iolnj6"},
    @{name="B04-数据反馈"; localPath="E-产出交付\03-数据反馈\B04-数据反馈.md"; token="U2ojd1EcJoivRRxwhjtcAts9nub"},
    @{name="B05-内容复盘与方法论"; localPath="D-内容创作\04-文案框架\B05-内容复盘与方法论.md"; token="C0Prd9t1IoFWBFxEowFcLMfWnTc"},
    @{name="B06-用户画像"; localPath="D-内容创作\01-用户画像\B06-用户画像.md"; token="Lfvvdtonco3E4QxYtGLc7VlEncc"},
    @{name="B07-产品管理"; localPath="D-内容创作\06-产品管理\B07-产品管理.md"; token="VXDsdYFv1ojO8Ox8jybck2kNn5f"},
    @{name="B08-变现路径"; localPath="E-产出交付\02-变现路径\B08-变现路径.md"; token="CIu9d3i24o1NwfxkNsNcSiKnn1c"},
    @{name="B09-客户与社群运营"; localPath="E-产出交付\04-客户运营\B09-客户与社群运营.md"; token="DkH3d26WqolhBoxNmckczW6inDe"},
    @{name="B10-合作管理"; localPath="E-产出交付\05-合作管理\B10-合作管理.md"; token="UVIodg9oponx2QxPi8gcOwVgnJc"},
    @{name="B11-IP增长与商业复盘"; localPath="C-记忆核心\03-经验沉淀\B11-IP增长与商业复盘.md"; token="NyJZdCom1ouE6uxxmgecuWPCn6E"},
    @{name="C01-目标院校库"; localPath="B-参考资料\保研资料\C01-目标院校库.md"; token="HIgoduBFMoffYUxGM3RcSaEqnSd"},
    @{name="C02-个人材料库"; localPath="B-参考资料\保研资料\C02-个人材料库.md"; token="JJJIdXIMqoSYe2xaYa0c5v6knQh"},
    @{name="C03-学术素材库"; localPath="B-参考资料\保研资料\C03-学术素材库.md"; token="VuEFdNLVaokSwrxSsKpcxCB5nw5"},
    @name="C04-面试准备"; localPath="B-参考资料\保研资料\C04-面试准备.md"; token="I7NvdUoEho4nUXxc8vCcjks1nVh"},
    @{name="C05-时间线与进度"; localPath="B-参考资料\保研资料\C05-时间线与进度.md"; token="HGNmdvPCdozm8BxxXbucZwPonZf"}
)

$stats = @{
    added = 0
    updated = 0
    skipped = 0
    failed = 0
}

Write-Host "=== 开始飞书增量同步 ===" -ForegroundColor Cyan
Write-Host "根目录: $PWD"
Write-Host ""

# 确保所有目录存在
foreach ($doc in $coreMapping) {
    $fullPath = Join-Path $PWD.Path $doc.localPath
    $dir = Split-Path $fullPath -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host "[1/3] 同步核心文档..." -ForegroundColor Yellow
Write-Host ""

foreach ($doc in $coreMapping) {
    $fullPath = Join-Path $PWD.Path $doc.localPath
    Write-Host "  $($doc.name) -> $($doc.localPath)" -NoNewline

    # 获取飞书修改时间
    $metadataJson = & $LARK_CLI drive metas get --params "{`"file_token`": `"$($doc.token)`"}" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n    ❌ 获取元数据失败" -ForegroundColor Red
        $stats.failed += 1
        continue
    }

    $metadata = $metadataJson | ConvertFrom-Json
    if ($metadata.code -ne 0 -or -not $metadata.data) {
        Write-Host "`n    ❌ 元数据解析失败" -ForegroundColor Red
        $stats.failed += 1
        continue
    }

    $feishuModified = $metadata.data.modified_time

    # 判断是否需要更新
    $needUpdate = $false
    if (-not (Test-Path $fullPath)) {
        $needUpdate = $true
    } else {
        $localMtime = (Get-Item $fullPath).LastWriteTimeUtc.ToUnixTimeSeconds()
        if ($feishuModified -gt $localMtime) {
            $needUpdate = $true
        }
    }

    if (-not $needUpdate) {
        Write-Host "`n    ⏭️  跳过（本地已是最新）" -ForegroundColor Gray
        $stats.skipped += 1
        continue
    }

    if (Test-Path $fullPath) {
        Write-Host "`n    📝 更新（飞书有更新）" -ForegroundColor Blue
        $stats.updated += 1
    } else {
        Write-Host "`n    🆕 新增（本地不存在）" -ForegroundColor Green
        $stats.added += 1
    }

    # 拉取内容
    $content = & $LARK_CLI docs +fetch --doc $($doc.token) 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    ❌ 拉取内容失败" -ForegroundColor Red
        $stats.failed += 1
        continue
    }

    # 保存到本地，使用UTF8编码
    $content | Out-File $fullPath -Encoding UTF8
}

Write-Host ""
Write-Host "[2/3] 同步 kunki输入 -> C-记忆核心/02-每日输入/" -ForegroundColor Yellow
Write-Host ""

# 创建目标目录
$dailyInputDir = Join-Path $PWD.Path "C-记忆核心\02-每日输入"
if (!(Test-Path $dailyInputDir)) {
    New-Item -ItemType Directory -Path $dailyInputDir -Force | Out-Null
}

# 列出kunki输入文件夹
$kunkiInputToken = "QAJSftp5hleHpHdLseKcd93TnAe"
$filesJson = & $LARK_CLI drive files list --page-all --params "{`"folder_token`": `"$kunkiInputToken`"}" 2>$null
if ($LASTEXITCODE -eq 0) {
    $filesResult = $filesJson | ConvertFrom-Json
    if ($filesResult.code -eq 0 -and $filesResult.data.files) {
        $files = $filesResult.data.files | Where-Object { $_.type -eq "docx" }
        Write-Host "  找到 $($files.Count) 个文档"

        foreach ($file in $files) {
            $name = $file.name
            $token = $file.token
            $modifiedTime = $file.modified_time
            $localPath = Join-Path $dailyInputDir "$name.md"

            $needUpdate = $false
            if (-not (Test-Path $localPath)) {
                $needUpdate = $true
            } else {
                $localMtime = (Get-Item $localPath).LastWriteTimeUtc.ToUnixTimeSeconds()
                if ($modifiedTime -gt $localMtime) {
                    $needUpdate = $true
                }
            }

            if (-not $needUpdate) {
                Write-Host "    ⏭️  $name -> 跳过（本地已是最新）" -ForegroundColor Gray
                $stats.skipped += 1
                continue
            }

            if (Test-Path $localPath) {
                Write-Host "    📝 $name -> 更新" -ForegroundColor Blue
                $stats.updated += 1
            } else {
                Write-Host "    🆕 $name -> 新增" -ForegroundColor Green
                $stats.added += 1
            }

            $content = & $LARK_CLI docs +fetch --doc $token 2>$null
            if ($LASTEXITCODE -eq 0) {
                $content | Out-File $localPath -Encoding UTF8
            } else {
                Write-Host "    ❌ $name -> 拉取失败" -ForegroundColor Red
                $stats.failed += 1
            }
        }
    }
}

Write-Host ""
Write-Host "[3/3] 同步 kunki输出/articles -> E-产出交付/01-已发文案/" -ForegroundColor Yellow
Write-Host ""

$articlesDir = Join-Path $PWD.Path "E-产出交付\01-已发文案"
if (!(Test-Path $articlesDir)) {
    New-Item -ItemType Directory -Path $articlesDir -Force | Out-Null
}

$kunkiOutputToken = "IUWIfp3eKlEQk9dfzsNcphzknJi"
$outputFilesJson = & $LARK_CLI drive files list --page-all --params "{`"folder_token`": `"$kunkiOutputToken`"}" 2>$null
if ($LASTEXITCODE -eq 0) {
    $outputResult = $outputFilesJson | ConvertFrom-Json
    if ($outputResult.code -eq 0 -and $outputResult.data.files) {
        # 先找articles子文件夹
        $articlesFolder = $outputResult.data.files | Where-Object { $_.type -eq "folder" -and $_.name -eq "articles" }
        if ($articlesFolder) {
            $articlesToken = $articlesFolder.token
            $articlesFilesJson = & $LARK_CLI drive files list --page-all --params "{`"folder_token`": `"$articlesToken`"}" 2>$null
            if ($LASTEXITCODE -eq 0) {
                $articlesResult = $articlesFilesJson | ConvertFrom-Json
                if ($articlesResult.code -eq 0 -and $articlesResult.data.files) {
                    $files = $articlesResult.data.files
                    Write-Host "  articles 文件夹内有 $($files.Count) 个项目"

                    foreach ($file in $files) {
                        if ($file.type -eq "docx") {
                            $name = $file.name
                            $token = $file.token
                            $modifiedTime = $file.modified_time
                            $localPath = Join-Path $articlesDir "$name.md"

                            $needUpdate = $false
                            if (-not (Test-Path $localPath)) {
                                $needUpdate = $true
                            } else {
                                $localMtime = (Get-Item $localPath).LastWriteTimeUtc.ToUnixTimeSeconds()
                                if ($modifiedTime -gt $localMtime) {
                                    $needUpdate = $true
                                }
                            }

                            if (-not $needUpdate) {
                                Write-Host "    ⏭️  $name -> 跳过" -ForegroundColor Gray
                                $stats.skipped += 1
                                continue
                            }

                            if (Test-Path $localPath) {
                                Write-Host "    📝 $name -> 更新" -ForegroundColor Blue
                                $stats.updated += 1
                            } else {
                                Write-Host "    🆕 $name -> 新增" -ForegroundColor Green
                                $stats.added += 1
                            }

                            $content = & $LARK_CLI docs +fetch --doc $token 2>$null
                            if ($LASTEXITCODE -eq 0) {
                                $content | Out-File $localPath -Encoding UTF8
                            } else {
                                Write-Host "    ❌ $name -> 拉取失败" -ForegroundColor Red
                                $stats.failed += 1
                            }
                        }
                        elseif ($file.type -eq "folder") {
                            # 处理分类子文件夹
                            $subfolderName = $file.name
                            $subfolderToken = $file.token
                            $modifiedTime = $file.modified_time
                            $localSubfolder = Join-Path $articlesDir $subfolderName

                            if (!(Test-Path $localSubfolder)) {
                                New-Item -ItemType Directory -Path $localSubfolder -Force | Out-Null
                            }

                            Write-Host "  处理分类子文件夹: $subfolderName"

                            # 列出子文件夹内容
                            $subFilesJson = & $LARK_CLI drive files list --page-all --params "{`"folder_token`": `"$subfolderToken`"}" 2>$null
                            if ($LASTEXITCODE -eq 0) {
                                $subResult = $subFilesJson | ConvertFrom-Json
                                if ($subResult.code -eq 0 -and $subResult.data.files) {
                                    foreach ($subFile in $subResult.data.files) {
                                        if ($subFile.type -ne "docx") { continue }

                                        $subName = $subFile.name
                                        $subToken = $subFile.token
                                        $subModified = $subFile.modified_time
                                        $subLocalPath = Join-Path $localSubfolder "$subName.md"

                                        $needUpdate = $false
                                        if (-not (Test-Path $subLocalPath)) {
                                            $needUpdate = $true
                                        } else {
                                            $localMtime = (Get-Item $subLocalPath).LastWriteTimeUtc.ToUnixTimeSeconds()
                                            if ($subModified -gt $localMtime) {
                                                $needUpdate = $true
                                            }
                                        }

                                        if (-not $needUpdate) {
                                            Write-Host "    ⏭️  $subfolderName/$subName -> 跳过" -ForegroundColor Gray
                                            $stats.skipped += 1
                                            continue
                                        }

                                        if (Test-Path $subLocalPath) {
                                            Write-Host "    📝 $subfolderName/$subName -> 更新" -ForegroundColor Blue
                                            $stats.updated += 1
                                        } else {
                                            Write-Host "    🆕 $subfolderName/$subName -> 新增" -ForegroundColor Green
                                            $stats.added += 1
                                        }

                                        $content = & $LARK_CLI docs +fetch --doc $subToken 2>$null
                                        if ($LASTEXITCODE -eq 0) {
                                            $content | Out-File $subLocalPath -Encoding UTF8
                                        } else {
                                            Write-Host "    ❌ $subfolderName/$subName -> 拉取失败" -ForegroundColor Red
                                            $stats.failed += 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            Write-Host "  未找到 articles 文件夹"
        }
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ 飞书增量同步完成!" -ForegroundColor Green
Write-Host "  🆕 新增文件: $($stats.added)"
Write-Host "  📝 更新文件: $($stats.updated)"
Write-Host "  ⏭️  跳过文件: $($stats.skipped)"
Write-Host "  ❌ 失败文件: $($stats.failed)"
Write-Host "============================================================" -ForegroundColor Cyan
